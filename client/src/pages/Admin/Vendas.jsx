import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useConfig } from '../../contexts/ConfigContext';
import API_URL from '../../config/api';
import {
  AdminContainer,
  Sidebar,
  Logo,
  NavMenu,
  NavItem,
  NavLink,
  Content,
  Header,
  PageTitle,
  ActionButton,
  SecondaryButton,
  Table,
  Th,
  Td,
  Tr,
  SuccessMessage,
  ErrorMessage
} from '../../styles/AdminStyles';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  h3 {
    font-size: 1rem;
    color: var(--accent);
    margin-bottom: 10px;
  }
  
  p {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--primary);
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: var(--accent);
`;

const NoDataContainer = styled.div`
  text-align: center;
  padding: 40px 0;
  color: var(--accent);
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
  
  button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    &.active {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }
    
    &:disabled {
      background-color: #f5f5f5;
      color: #aaa;
      cursor: not-allowed;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  
  &.paid {
    background-color: #d4edda;
    color: #155724;
  }
  
  &.pending {
    background-color: #fff3cd;
    color: #856404;
  }
  
  &.cancelled {
    background-color: #f8d7da;
    color: #721c24;
  }
`;

const CartBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  background-color: #e0f7fa;
  color: #0288d1;
  margin-left: 8px;
`;

const GroupHeader = styled.tr`
  background-color: #f8f9fa;
  
  td {
    padding: 12px 15px;
    font-weight: 500;
    color: var(--primary);
    border-bottom: 2px solid #eaeaea;
  }
`;

const GroupRow = styled.tr`
  background-color: ${props => props.isGrouped ? '#fafafa' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.isGrouped ? '#f5f5f5' : '#f9f9f9'};
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 5px;
  
  &:hover {
    color: var(--accent);
  }
`;

const DetailRow = styled.tr`
  background-color: #f8f9fa;
  
  td {
    padding: 15px;
    border-bottom: 1px solid #eaeaea;
  }
`;

const DetailTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 8px 10px;
    text-align: left;
    border-bottom: 1px solid #eaeaea;
  }
  
  th {
    font-weight: 500;
    color: var(--accent);
    background-color: #f0f0f0;
  }
`;

const ViewModeToggle = styled.div`
  display: flex;
  margin-bottom: 20px;
  
  button {
    padding: 8px 15px;
    background-color: white;
    border: 1px solid #ddd;
    cursor: pointer;
    
    &:first-child {
      border-radius: 4px 0 0 4px;
    }
    
    &:last-child {
      border-radius: 0 4px 4px 0;
    }
    
    &.active {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }
  }
`;

const AdminVendas = () => {
  const [sales, setSales] = useState([]);
  const [groupedSales, setGroupedSales] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalAmount: 0,
    salesByMethod: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' ou 'individual'
  const [expandedGroups, setExpandedGroups] = useState({});
  const { config } = useConfig();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };
  
  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [salesResponse, statsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/sales`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/sales/stats/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setSales(salesResponse.data);
      
      // Agrupar vendas por paymentId (compras do mesmo carrinho)
      const grouped = {};
      salesResponse.data.forEach(sale => {
        if (sale.paymentId) {
          if (!grouped[sale.paymentId]) {
            grouped[sale.paymentId] = {
              paymentId: sale.paymentId,
              customerName: sale.customerName,
              customerEmail: sale.customerEmail,
              paymentMethod: sale.paymentMethod,
              status: sale.status,
              createdAt: sale.createdAt,
              items: [],
              totalAmount: 0
            };
          }
          grouped[sale.paymentId].items.push(sale);
          grouped[sale.paymentId].totalAmount += sale.amount;
        } else {
          // Para vendas sem paymentId, criar um grupo único
          const uniqueId = `single-${sale.id}`;
          grouped[uniqueId] = {
            paymentId: uniqueId,
            customerName: sale.customerName,
            customerEmail: sale.customerEmail,
            paymentMethod: sale.paymentMethod,
            status: sale.status,
            createdAt: sale.createdAt,
            items: [sale],
            totalAmount: sale.amount,
            isSingle: true
          };
        }
      });
      
      // Converter o objeto agrupado em array e ordenar por data
      const groupedArray = Object.values(grouped).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setGroupedSales(groupedArray);
      setStats(statsResponse.data);
      setError('');
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      setError('Não foi possível carregar as vendas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleSyncOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/mercadolivre/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(response.data.message || 'Vendas sincronizadas com sucesso!');
      setError('');
      fetchSales();
    } catch (err) {
      console.error('Erro ao sincronizar vendas:', err);
      setError('Não foi possível sincronizar as vendas. Tente novamente.');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'mercadopago':
        return 'Mercado Pago';
      case 'pix':
        return 'PIX';
      default:
        return method;
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };
  
  const toggleExpand = (paymentId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [paymentId]: !prev[paymentId]
    }));
  };
  
  // Filtrar vendas individuais
  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.customerEmail && sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sale.present && sale.present.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filtrar vendas agrupadas
  const filteredGroupedSales = groupedSales.filter(group => {
    const matchesSearch = 
      group.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.customerEmail && group.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      group.items.some(item => 
        item.present && item.present.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Paginação para modo individual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  
  // Paginação para modo agrupado
  const currentGroupedItems = filteredGroupedSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalGroupedPages = Math.ceil(filteredGroupedSales.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const renderPagination = () => {
    const pages = viewMode === 'grouped' ? totalGroupedPages : totalPages;
    
    if (pages <= 1) return null;
    
    const pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <Pagination>
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
        
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === pages}
        >
          &raquo;
        </button>
      </Pagination>
    );
  };
  
  const renderIndividualSales = () => {
    if (currentItems.length === 0) {
      return (
        <Tr>
          <Td colSpan="6">
            <NoDataContainer>
              Nenhuma venda encontrada com os filtros atuais.
            </NoDataContainer>
          </Td>
        </Tr>
      );
    }
    
    return currentItems.map((sale) => (
      <Tr key={sale.id}>
        <Td>{formatDate(sale.createdAt)}</Td>
        <Td>
          {sale.customerName}
          {sale.customerEmail && <div><small>{sale.customerEmail}</small></div>}
        </Td>
        <Td>{sale.present ? sale.present.name : 'Produto não encontrado'}</Td>
        <Td>{formatCurrency(sale.amount)}</Td>
        <Td>{getPaymentMethodLabel(sale.paymentMethod)}</Td>
        <Td>
          <StatusBadge className={sale.status}>
            {getStatusLabel(sale.status)}
          </StatusBadge>
        </Td>
      </Tr>
    ));
  };
  
  const renderGroupedSales = () => {
    if (currentGroupedItems.length === 0) {
      return (
        <Tr>
          <Td colSpan="6">
            <NoDataContainer>
              Nenhuma venda encontrada com os filtros atuais.
            </NoDataContainer>
          </Td>
        </Tr>
      );
    }
    
    return currentGroupedItems.map((group) => {
      const isExpanded = expandedGroups[group.paymentId] || false;
      const isMultipleItems = group.items.length > 1;
      
      return (
        <React.Fragment key={group.paymentId}>
          <GroupRow isGrouped={isMultipleItems}>
            <Td>
              {isMultipleItems && (
                <ExpandButton onClick={() => toggleExpand(group.paymentId)}>
                  {isExpanded ? '−' : '+'}
                </ExpandButton>
              )}
              {formatDate(group.createdAt)}
            </Td>
            <Td>
              {group.customerName}
              {group.customerEmail && <div><small>{group.customerEmail}</small></div>}
            </Td>
            <Td>
              {isMultipleItems ? (
                <>
                  Compra múltipla
                  <CartBadge>{group.items.length} itens</CartBadge>
                </>
              ) : (
                group.items[0].present ? group.items[0].present.name : 'Produto não encontrado'
              )}
            </Td>
            <Td>{formatCurrency(group.totalAmount)}</Td>
            <Td>{getPaymentMethodLabel(group.paymentMethod)}</Td>
            <Td>
              <StatusBadge className={group.status}>
                {getStatusLabel(group.status)}
              </StatusBadge>
            </Td>
          </GroupRow>
          
          {isExpanded && isMultipleItems && (
            <DetailRow>
              <Td colSpan="6">
                <DetailTable>
                  <thead>
                    <tr>
                      <th>Presente</th>
                      <th>Quantidade</th>
                      <th>Valor Unitário</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.present ? item.present.name : 'Produto não encontrado'}</td>
                        <td>{item.quantity || 1}</td>
                        <td>{formatCurrency(item.amount / (item.quantity || 1))}</td>
                        <td>{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </DetailTable>
              </Td>
            </DetailRow>
          )}
        </React.Fragment>
      );
    });
  };
  
  if (loading) {
    return (
      <AdminContainer>
        <Sidebar>
          <Logo>
            <h1>
              {config?.siteTitle || 'Marília & Iago'}
            </h1>
          </Logo>
          
          <NavMenu>
            <NavItem>
              <NavLink to="/admin">Dashboard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/presentes">Presentes</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/vendas" className="active">Vendas</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/config">Configurações</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/conteudo">Conteúdo</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/historia">Nossa História</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/album">Álbum</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/rsvp">RSVPs</NavLink>
            </NavItem>
          </NavMenu>
        </Sidebar>
        
        <Content>
          <Header>
            <PageTitle>Vendas</PageTitle>
            <ActionButton onClick={handleSyncOrders}>Sincronizar</ActionButton>
            <SecondaryButton onClick={handleLogout}>Sair</SecondaryButton>
          </Header>
          <LoadingContainer>Carregando vendas...</LoadingContainer>
        </Content>
      </AdminContainer>
    );
  }
  
  if (error) {
    return (
      <AdminContainer>
        <Sidebar>
          <Logo>
            <h1>
              {config?.siteTitle || 'Marília & Iago'}
            </h1>
          </Logo>
          
          <NavMenu>
            <NavItem>
              <NavLink to="/admin">Dashboard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/presentes">Presentes</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/vendas" className="active">Vendas</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/config">Configurações</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/conteudo">Conteúdo</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/historia">Nossa História</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/album">Álbum</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/rsvp">RSVPs</NavLink>
            </NavItem>
          </NavMenu>
        </Sidebar>
        
        <Content>
          <Header>
            <PageTitle>Vendas</PageTitle>
            <ActionButton onClick={handleSyncOrders}>Sincronizar</ActionButton>
            <SecondaryButton onClick={handleLogout}>Sair</SecondaryButton>
          </Header>
          <ErrorMessage>{error}</ErrorMessage>
        </Content>
      </AdminContainer>
    );
  }
  
  return (
    <AdminContainer>
      <Sidebar>
        <Logo>
          <h1>
            {config?.siteTitle || 'Marília & Iago'}
          </h1>
        </Logo>
        
        <NavMenu>
          <NavItem>
            <NavLink to="/admin">Dashboard</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/presentes">Presentes</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/vendas" className="active">Vendas</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/config">Configurações</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/conteudo">Conteúdo</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/historia">Nossa História</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/album">Álbum</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/rsvp">RSVPs</NavLink>
          </NavItem>
        </NavMenu>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>Vendas</PageTitle>
          <ActionButton onClick={handleSyncOrders}>Sincronizar</ActionButton>
          <SecondaryButton onClick={handleLogout}>Sair</SecondaryButton>
        </Header>

        {success && <SuccessMessage>{success}</SuccessMessage>}

        <StatsContainer>
          <StatCard>
            <h3>Total de Vendas</h3>
            <p>{stats.totalSales}</p>
          </StatCard>
          <StatCard>
            <h3>Valor Total</h3>
            <p>{formatCurrency(stats.totalAmount)}</p>
          </StatCard>
          {stats.salesByMethod && stats.salesByMethod.map((method) => (
            <StatCard key={method.paymentMethod}>
              <h3>Vendas via {getPaymentMethodLabel(method.paymentMethod)}</h3>
              <p>{method._count.id}</p>
            </StatCard>
          ))}
        </StatsContainer>
        
        <ViewModeToggle>
          <button 
            className={viewMode === 'grouped' ? 'active' : ''}
            onClick={() => setViewMode('grouped')}
          >
            Agrupar por Compra
          </button>
          <button 
            className={viewMode === 'individual' ? 'active' : ''}
            onClick={() => setViewMode('individual')}
          >
            Itens Individuais
          </button>
        </ViewModeToggle>
        
        <FilterContainer>
          <SearchInput 
            type="text" 
            placeholder="Buscar por nome, email ou presente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <FilterSelect 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="paid">Pagos</option>
            <option value="pending">Pendentes</option>
            <option value="cancelled">Cancelados</option>
          </FilterSelect>
        </FilterContainer>
        
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Cliente</Th>
                <Th>Presente</Th>
                <Th>Valor</Th>
                <Th>Método</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {viewMode === 'grouped' ? renderGroupedSales() : renderIndividualSales()}
            </tbody>
          </Table>
        </TableContainer>
        
        {renderPagination()}
      </Content>
    </AdminContainer>
  );
};

export default AdminVendas;
