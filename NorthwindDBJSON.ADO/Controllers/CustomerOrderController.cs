using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NorthwindDBJSON.ADO.Data;
using NorthwindDBJSON.ADO.Models;
using System.Web;

namespace NorthwindDBJSON.ADO.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CustomerOrderController : ControllerBase
    {
        private readonly ICustomersOrdersRepository _repo;

        public CustomerOrderController(ICustomersOrdersRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<ActionResult<List<CustomerOrder>>> GetCustomers([FromQuery] string FromDate, 
                                                              [FromQuery] string ToDate,
                                                              [FromQuery] string OrderBy,
                                                              [FromQuery] string AscDesc,
                                                              [FromQuery] string OrderID,
                                                              [FromQuery] string CustomerID,
                                                              [FromQuery] string CompanyName,
                                                              [FromQuery] string Country,
                                                              [FromQuery] string SalesRep,
                                                              [FromQuery] string Shipper)
        {
            CustomersOrdersSqlParm _parm = new CustomersOrdersSqlParm();
            _parm.FromDate = FromDate;
            _parm.ToDate = ToDate;
            _parm.OrderBy = OrderBy;
            _parm.AscDesc = AscDesc;
            _parm.OrderID = OrderID;
            _parm.CustomerID = CustomerID;
            _parm.CompanyName = CompanyName;
            _parm.Country = Country;
            _parm.SalesRep = SalesRep;
            _parm.Shipper = Shipper;

            return await _repo.GetOrders(_parm);
        }
    }
}