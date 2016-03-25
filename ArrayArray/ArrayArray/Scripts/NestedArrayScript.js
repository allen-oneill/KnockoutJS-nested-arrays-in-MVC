/* Overview:

Sales person can operate in many regions
Sales person can have many customers
..... customers an have many orders

Objective is to show:

(1) show saving/loading using amplify.js with ko.mapping (methods save to storage and load from storage)
(2) show sorting or draggable items using KO sortable plugin
(3) show sending of ViewModel data to server with AJAX post
(4) show getting count of items from mapped observable array

*/


// setup defaults for validation
var validationOptions = {
    insertMessages: true,
    decorateElement: true,
    errorElementClass: 'errorCSS',
    messagesOnModified: true,
    debug: true,
    grouping: {
        deep: true,
        observable: false //Needed so added objects AFTER the initial setup get included
    },
};

ko.validation.init(validationOptions);



var Region = function (data) {
    var self = this;
    if (data != null) {
        ko.mapping.fromJS(data, {}, self);
    } else {
        self.ID = ko.observable();
        self.SortOrder = ko.observable();
        self.Name = ko.observable().extend({
            required: true
        });
    }

    self.Name.extend({
        required: {
            message: '* Name needed'
        }
    });
}

var Customer = function (data) {
    var self = this;
    if (data != null) {
        ko.mapping.fromJS(data, { Orders: orderMapping }, self);
    } else {
        self.ID = ko.observable();
        self.SortOrder = ko.observable();
        self.Name = ko.observable().extend({
            required: true
        });
        self.Orders = ko.observable(); // array of Orders
        self.OrdersTotal = ko.computed(function () {
            return self.FirstName() + " " + self.LastName();
        }, self);
    }

    // operations
    self.addOrder = function () {
        self.Orders.push(new Order({
            ID: null,
            Date: "",
            Value: ""
        }));
    }
    self.removeOrder = function (Order) {
        self.Orders.remove(Order);
    }

    self.Name.extend({
        required: {
            message: '* Name needed'
        }
    });
}

var Order = function (data) {
    var self = this;
    if (data != null) {
        ko.mapping.fromJS(data, {}, self); // in brackets need the mapping function to pass
    } else {
        self.ID = ko.observable();
        self.Date = ko.observable().extend({
            required: true
        });
        self.Value = ko.observable().extend({
            required: true
        });
    }
    self.Value.extend({
        required: {
            message: '* Value needed'
        }
    });
}

// define view model
var SalesPerson = function (data) {
    var self = this;
    if (data != null) {
        ko.mapping.fromJS(data, { Regions: regionMapping, Customers: customerMapping }, self);
    } else {
        self.ID = ko.observable();
        self.FirstName = ko.observable().extend({
            required: {
                message: '* Persons name needed'
            }
        });
        self.LastName = ko.observable();
        self.FullName = ko.computed(function () {
            var outputString = "";
            if (self.FirstName() != null)
                outputString += self.FirstName();
            if (self.LastName() != null)
                outputString += self.LastName();
            return outputString;
        }, self);
        self.Regions = ko.observableArray();
        self.Customers = ko.observableArray(); // array of "Customers", who each have many orders
    }
    // create validation group
    self.orderErrors = ko.validation.group(self);

    self.checkValid = function () {
        if (self.isValid()) {
            alert('All ok!');
        } else {
            self.orderErrors.showAllMessages();
        }
    }

    // operations
    self.addRegion = function () {
        self.Regions.push(new Region({
            ID: null,
            SortOrder: self.Regions().length,
            Name: ""
        }));
    }

    self.removeRegion = function (Region) {
        self.Regions.remove(Region);
    }
    self.addCustomer = function () {
        self.Customers.push(new Customer({
            ID: null,
            Name: "",
            Orders: []
        }));
    }
    self.removeCustomer = function (Customer) {
        self.Customers.remove(Customer);
    }

    self.clearData = function () {
        $('#clip').val('');
        self.ID("");
        self.FirstName("");
        self.LastName("");
        self.Regions.removeAll();
        self.Customers.removeAll();
    }

    self.saveDataToInput = function () {
        $('#clip').val(ko.mapping.toJSON(self));
    }

    self.saveDataToServer = function (){
        var DataToSend = ko.mapping.toJSON(self);
        $.ajax({
            type: 'post',
            url: '/home/SaveModel',
            contentType: 'application/json',
            data: DataToSend,
            success: function (dataReceived) {
                alert('sent: ' + dataReceived)
            },
            fail: function (dataReceived) {
                alert('fail: ' + dataReceived)
            }


            });


    };

    self.saveData = function () {
        data = ko.mapping.toJSON(self);
        alert("JSON:" + data);
        data = ko.mapping.toJS(self);
        alert("JS:" + data);
        alert("JS_s:" + JSON.stringify(data));
        amplify.store("ArrayArray", ko.mapping.toJS(self));
    }

    // load data into model
    self.loadInlineData = function () {
        ko.mapping.fromJS(modeldata, { Regions: regionMapping, Customers: customerMapping }, self);
    }

    self.loadStorageData = function () {
        ko.mapping.fromJS(amplify.store("ArrayArray"), { Regions: regionMapping, Customers: customerMapping }, self);
    }

    self.Errors = ko.validation.group(self);
}

var regionMapping = {
    create: function (options) {
        return new Region(options.data);
    }
};

var customerMapping = {
    create: function (options) {
        return new Customer(options.data);
    }
};

var orderMapping = {
    create: function (options) {
        return new Order(options.data);
    }
};


$(document).ready(function () {
    var viewModel = new SalesPerson();
    ko.applyBindings(viewModel);

});



// data to load into viewmodel
var modeldata = { "FirstName": "Fred", "LastName": "Test", "Regions": [{ "ID": null, "SortOrder": "0", "Name": "Region 001" }, { "ID": null, "SortOrder": "1", "Name": "Region 002" }, { "ID": null, "SortOrder": "2", "Name": "Region 003" }], "Customers": [{ "ID": null, "SortOrder": "0", "Name": "Customer 001", "Orders": [{ "ID": null, "Date": "Cust 001 Ord 001", "Value": "1" }, { "ID": null, "Date": "Cust 001 Ord 002", "Value": "2" }, { "ID": null, "Date": "Cust 001 Ord 003", "Value": "3" }] }, { "ID": null, "SortOrder": "1", "Name": "Customer 002", "Orders": [{ "ID": null, "Date": "Cust 002 Ord 001", "Value": "1" }, { "ID": null, "Date": "Cust 002 Ord 002", "Value": "2" }] }] };




