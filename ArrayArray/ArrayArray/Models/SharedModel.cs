using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArrayArray.Models
{
    [Serializable]
    public class SalesPerson
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<Region> Regions {get; set;}
        public List<Customer> Customers {get; set;}

        public SalesPerson()
        { 
        Regions = new List<Region>();
        Customers = new List<Customer>();
        }
    }


    public class Region
    {
        public int ID { get; set;}
        public string SortOrder { get; set; }
        public string Name { get; set; }

    }

    public class Customer
    {
        public int ID { get; set; }
        public string SortOrder { get; set; }
        public string Name { get; set; }
        public List<Order> Orders { get; set; }

        public Customer()
        {
            Orders = new List<Order>();
        }
    }


    public class Order
    {
        public int ID { get; set; }
        public string Date { get; set; }
        public string Value { get; set; }        
    }

}






