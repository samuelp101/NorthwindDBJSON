using Microsoft.Extensions.Configuration;
using NorthwindDBJSON.ADO.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindDBJSON.ADO.Data
{
    public class CustomersOrdersRepository : ICustomersOrdersRepository
    {
        private readonly IConfiguration _configuration;

        public CustomersOrdersRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public CustomerOrder AddNewOrder(CustomerOrder obj)
        {
            throw new NotImplementedException();
        }

        public void DeleteOrder(int orderId)
        {
            throw new NotImplementedException();
        }

        public CustomerOrder GetOrderById(int orderId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<CustomerOrder>> GetOrders(CustomersOrdersSqlParm ordersParm)
        {
            List<CustomerOrder> _customerOrders = new List<CustomerOrder>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("NorthwindDB")))
                {
                    using (SqlCommand cm = new SqlCommand("dbo.spCustomersOrders_Get", conn))
                    {
                        cm.CommandType = CommandType.StoredProcedure;

                        if (!String.IsNullOrEmpty(ordersParm.FromDate)) { cm.Parameters.Add("FromDate", SqlDbType.VarChar).Value = ordersParm.FromDate; }
                        if (!String.IsNullOrEmpty(ordersParm.ToDate)) { cm.Parameters.Add("ToDate", SqlDbType.VarChar).Value = ordersParm.ToDate; }
                        if (!String.IsNullOrEmpty(ordersParm.OrderBy)) { cm.Parameters.Add("OrderBy", SqlDbType.VarChar).Value = ordersParm.OrderBy; }
                        if (!String.IsNullOrEmpty(ordersParm.AscDesc)) { cm.Parameters.Add("AscDesc", SqlDbType.VarChar).Value = ordersParm.AscDesc; }
                        if (!String.IsNullOrEmpty(ordersParm.OrderID)) { cm.Parameters.Add("OrderID", SqlDbType.VarChar).Value = ordersParm.OrderID; }
                        if (!String.IsNullOrEmpty(ordersParm.CustomerID)) { cm.Parameters.Add("CustomerID", SqlDbType.VarChar).Value = ordersParm.CustomerID; }
                        if (!String.IsNullOrEmpty(ordersParm.CompanyName)) { cm.Parameters.Add("CompanyName", SqlDbType.VarChar).Value = ordersParm.CompanyName; }
                        if (!String.IsNullOrEmpty(ordersParm.Country)) { cm.Parameters.Add("Country", SqlDbType.VarChar).Value = ordersParm.Country; }
                        if (!String.IsNullOrEmpty(ordersParm.SalesRep)) { cm.Parameters.Add("SalesRep", SqlDbType.VarChar).Value = ordersParm.SalesRep; }
                        if (!String.IsNullOrEmpty(ordersParm.Shipper)) { cm.Parameters.Add("Shipper", SqlDbType.VarChar).Value = ordersParm.Shipper; }

                        await conn.OpenAsync();
                        using (SqlDataReader rdr = await cm.ExecuteReaderAsync())
                        {
                            if (rdr.HasRows)
                            {
                                while (rdr.Read())
                                {
                                    CustomerOrder _order = new CustomerOrder();

                                    _order.CustomerID = rdr["CustomerID"].ToString();
                                    _order.OrderID = rdr["OrderID"].ToString();
                                    _order.CompanyName = rdr["CompanyName"].ToString();
                                    _order.Country = rdr["Country"].ToString();
                                    _order.SalesRepID = rdr["SalesRepID"].ToString();
                                    _order.SalesRep = rdr["SalesRep"].ToString();
                                    _order.OrderDate = rdr["OrderDate"].ToString();
                                    _order.Shipper = rdr["Shipper"].ToString();
                                    _order.Freight = rdr["Freight"].ToString();
                                    _order.OrderTotal = rdr["OrderTotal"].ToString();

                                    SetOrderByValue(ref _order, ordersParm.OrderBy);
                                    _customerOrders.Add(_order);
                                }
                            }
                        }
                    }
                }

            }
            catch (Exception)
            {
                throw;
            }

            return _customerOrders;

        }

        public void UpdateOrder(CustomerOrder obj)
        {
            throw new NotImplementedException();
        }

        public void SetOrderByValue(ref CustomerOrder order, string OrderBy)
        {
            switch (OrderBy)
            {
                case "CustomerID":
                    order.OrderByValue = order.CustomerID;
                    break;
                case "CompanyName":
                    order.OrderByValue = order.CompanyName;
                    break;
                case "Country":
                    order.OrderByValue = order.Country;
                    break;
                case "SalesRep":
                    order.OrderByValue = order.SalesRep;
                    break;
                case "Shipper":
                    order.OrderByValue = order.Shipper;
                    break;
            }
        }
    }
}
