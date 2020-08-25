using Microsoft.AspNetCore.Mvc;

namespace NorthwindDBJSON.ADO.Data
{
    public class CustomersOrdersSqlParm
    {       

        [FromQuery]
        public string FromDate { get; set; }

        [FromQuery]
        public string ToDate { get; set; }

        [FromQuery]
        public string OrderBy { get; set; }

        [FromQuery]
        public string AscDesc { get; set; }

        [FromQuery]
        public string OrderID { get; set; }

        [FromQuery]
        public string CustomerID { get; set; }

        [FromQuery]
        public string CompanyName { get; set; }

        [FromQuery]
        public string Country { get; set; }

        [FromQuery]
        public string SalesRep { get; set; }

        [FromQuery]
        public string Shipper { get; set; }

    }
}
