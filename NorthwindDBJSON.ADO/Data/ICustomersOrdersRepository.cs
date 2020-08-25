using NorthwindDBJSON.ADO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindDBJSON.ADO.Data
{
    public interface ICustomersOrdersRepository
    {
        Task<List<CustomerOrder>> GetOrders(CustomersOrdersSqlParm ordersParm);
        CustomerOrder GetOrderById(Int32 orderId);
        CustomerOrder AddNewOrder(CustomerOrder obj);
        void UpdateOrder(CustomerOrder obj);
        void DeleteOrder(Int32 orderId);

    }
}
