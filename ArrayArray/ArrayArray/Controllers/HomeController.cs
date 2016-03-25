using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArrayArray.Models;

namespace ArrayArray.Controllers
{
    public class HomeController : Controller
    {
        // returns the initial view page
        public ActionResult Index()
        {
            return View();
            // if we wish to pass data into the view page here, we could create our model "eg: salesPersonModel", and send it into the view "eg: return View(salesPersonModel)"
        }


        [HttpPost]

        public JsonResult SaveModel(SalesPerson SalesPerson)
        {
            // the JSON Knockout Model string sent in, maps directly to the "SalesPerson" model defined in SharedModel.cs
            var s = SalesPerson; // we can work with the Data model here - save to database / update, etc.            
            return null;
        }


    }
}