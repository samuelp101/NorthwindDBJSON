let PageMngr = null;

window.onload = window_onload;
function window_onload()
{
    try
    {
        PageMngr = new PageManager();
        PageMngr.DisplayInit();
        PageMngr.GetJsonData();        
    }
    catch (ex)
    {
        alert(ex.description);
        window.status = ex.description;
    }
}

function PageManager()
{
    let apiURL = "http://localhost:13900/api/CustomerOrder";
    let txtFromDate = document.getElementById("txtFromDate");
    let txtToDate = document.getElementById("txtToDate");
    let chkDisplaySubTotals = document.getElementById("chkDisplaySubTotals");
    let chkHideDetails = document.getElementById("chkHideDetails");

    let FromDate = "2019-01-01";
    txtFromDate.value = FromDate;
    let ToDate = "2019-12-31";
    txtToDate.value = ToDate;

    let OrderBy = "";
    let AscDesc = "0";
    let OrderID = "";
    let CustomerID = "";
    let CompanyName = "";
    let Country = "";
    let SalesRep = "";
    let Shipper = "";
    //let DisplaySubtotal = "0";
    //let HideDetails = "0";
    let TotalOrder = 0.0;
    let TotalFreight = 0.0;

    let ReportBody = document.getElementById("ReportBody");
    let ReportFooterBody = document.getElementById("ReportFooterBody");
    let dvErrorMessage = document.getElementById("dvErrorMessage");

    this.GetJsonData = GetJsonData;
    function GetJsonData()
    {
        let queryString = "?FromDate=" + FromDate + "&ToDate=" + ToDate;

        if (OrderBy.trim() != "") { queryString += "&OrderBy=" + OrderBy; }
        if (AscDesc.trim() != "")
        { queryString += "&AscDesc=" + AscDesc; }
        else
        { queryString += "&AscDesc=0"; }
        if (OrderID.trim() != "") { queryString += "&OrderID=" + OrderID; }
        if (CustomerID.trim() != "") { queryString += "&CustomerID=" + CustomerID; }
        if (CompanyName.trim() != "") { queryString += "&CompanyName=" + CompanyName; }
        if (Country.trim() != "") { queryString += "&Country=" + Country; }
        if (SalesRep.trim() != "") { queryString += "&SalesRep=" + SalesRep; }
        if (Shipper.trim() != "") { queryString += "&Shipper=" + Shipper; }

        // (apiURL + queryString) 
        // http://localhost:13967/api/CustomerOrder?FromDate=2019-8-1&ToDate=2019-9-1&OrderBy=CustomerID

        let XHR = new XMLHttpRequest();
        XHR.open("GET", apiURL + queryString, true);
        XHR.timeout = 10000;  // in milliseconds
        XHR.send();

        XHR.onload = function ()
        {
            DisplayJsonData(XHR.responseText);            
        }

        XHR.onerror = function ()
        {
            // routine to handle error
            alert("XMLHttpRequest Error");
        }

        XHR.ontimeout = function ()
        {
            // routine to handle timeout
            alert("XMLHttpRequest TimeOut");
        }

    }

    /*
     * Display JSON object array to an predefined HTML table
     */
    function DisplayJsonData(_response)
    {
        let _displayData = "";
        let _orderByValue = "";
        let _subTotalOrder = 0.0;
        let _subTotalFreight = 0.0;

        let _jsonData = JSON.parse(_response);

        if (_jsonData.length > 0)
        {
            _orderByValue = _jsonData[0]["orderByValue"];
        }
      
        for (let i = 0; i < _jsonData.length; i++)
        {
            if (OrderBy != "" && chkDisplaySubTotals.checked)
            {
                if (_orderByValue == _jsonData[i]["orderByValue"])
                {
                    _subTotalOrder += parseFloat(_jsonData[i]["orderTotal"].replace(/,/g, ''));
                    _subTotalFreight += parseFloat(_jsonData[i]["freight"].replace(/,/g, ''));
                }
                else
                {
                    _displayData += "<tr class='rwSubtotal'><th colspan='7'>Subtotal: ( " + _orderByValue + " ): </th>"
                        + "<th>" + _subTotalFreight.toFixed(2) + "</th>"
                        + "<th>" + _subTotalOrder.toFixed(2) + "</th></tr>";

                    _subTotalOrder = parseFloat(_jsonData[i]["orderTotal"].replace(/,/g, ''));
                    _subTotalFreight = parseFloat(_jsonData[i]["freight"].replace(/,/g, ''));
                    _orderByValue = _jsonData[i]["orderByValue"];
                }
            }            

            let _orderTotal = parseFloat(_jsonData[i]["orderTotal"].replace(/,/g, ''));
            let _freight = parseFloat(_jsonData[i]["freight"].replace(/,/g, ''));

            if ((!chkHideDetails.checked) || (!chkDisplaySubTotals.checked))
            {
                _displayData += "<tr><td>" + _jsonData[i]["orderID"] + "</td>"
                    + "<td>" + _jsonData[i]["customerID"] + "</td>"
                    + "<td>" + _jsonData[i]["companyName"] + "</td>"
                    + "<td>" + _jsonData[i]["country"] + "</td>"
                    + "<td>" + _jsonData[i]["salesRep"] + "</td>"
                    + "<td>" + _jsonData[i]["orderDate"] + "</td>"
                    + "<td>" + _jsonData[i]["shipper"] + "</td>"
                    + "<td>" + _freight.toFixed(2) + "</td>"
                    + "<td>" + _orderTotal.toFixed(2) + "</td></tr>";
            }

            TotalOrder += _orderTotal;
            TotalFreight += _freight;

        }

        if (OrderBy != "" && chkDisplaySubTotals.checked)
        {
            _displayData += "<tr class='rwSubtotal'><th colspan='7'>Subtotal: ( " + _orderByValue + " ): </th>"
                + "<th>" + _subTotalFreight.toFixed(2) + "</th>"
                + "<th>" + _subTotalOrder.toFixed(2) + "</th></tr>";
        }

        if (ReportBody)
        {
            ReportBody.innerHTML = _displayData;
        }

        if (ReportFooterBody)
        {
            let _footerData = "<tr class='rwFooter'><th>Total :</th>"
                + "<th>" + TotalFreight.toFixed(2) + "</th>"
                + "<th>" + TotalOrder.toFixed(2) + "</th></tr>";

            ReportFooterBody.innerHTML = _footerData;
        }

    }

    this.DisplayInit = DisplayInit;
    function DisplayInit()
    {
        let _today = new Date();
        ToDate = _today.getFullYear() + "-" + (_today.getMonth() + 1) + "-" + _today.getDate();
        if (txtToDate) { txtToDate.value = ToDate; }

        let _fromDate = new Date();
        _fromDate.setMonth(_fromDate.getMonth() - 12);
        FromDate = _fromDate.getFullYear() + "-" + (_fromDate.getMonth() + 1) + "-" + _fromDate.getDate();
        if (txtFromDate) { txtFromDate.value = FromDate; }

        chkDisplaySubTotals.checked = false;
        chkHideDetails.checked = false;
    }

    let cmdGo = document.getElementById("cmdGo");
    if (cmdGo) { cmdGo.onclick = cmdGo_onclick; }
    function cmdGo_onclick()
    {
        RefreshDisplay();
    }

    let hdnOrderBy = document.getElementById("hdnOrderBy");
    let hdnAscDesc = document.getElementById("hdnAscDesc");

    let tblFormHeader = document.getElementById("tblFormHeader");
    if (tblFormHeader) { tblFormHeader.onclick = tblFormHeader_onclick; }
    function tblFormHeader_onclick(e)
    {
        let evt = e || window.event;
        let elm = evt.srcElement || evt.target;
        if ((elm.id == "chkDisplaySubTotals") || (elm.id == "chkHideDetails"))
        {
            RefreshDisplay();
        }
    }

    let tblHeader = document.getElementById("tblReportHeader");
    if (tblHeader) { tblHeader.onclick = tblHeader_onclick; }
    function tblHeader_onclick(e)
    {
        let evt = e || window.event;
        let elm = evt.srcElement || evt.target;
        if (elm.tagName == "A")
        {
            let OrderBy = elm.id.replace("OrderBy.", "");
            if (hdnOrderBy.value == OrderBy)
            {
                hdnAscDesc.value = (hdnAscDesc.value == "1") ? "0" : "1";
            }
            else
            {
                hdnAscDesc.value = "0";
                hdnOrderBy.value = OrderBy;
            }
            RefreshDisplay();
            return false;
        }
        return true;
    }

    let Filters = document.getElementById("Filters");
    if (Filters) { Filters.onkeypress = txt_keypress; }
    function txt_keypress(e)
    {
        let evt = e || window.event;
        let kc = evt.keyCode || evt.which;
        if (kc == 13)
        {
            RefreshDisplay();
            return false;
        }
        return true;
    }

    function RefreshDisplay()
    {
        let elms = document.getElementsByTagName("INPUT");
        for (let ix = 0; ix < elms.length; ix++)
        {
            let elm = elms[ix];
            if (elm.type == "text")
            {
                switch (elm.id)
                {
                    case "txtFromDate":
                        FromDate = elm.value;
                        break;
                    case "txtToDate":
                        ToDate = elm.value;
                        break;
                    case "txtOrderID":
                        OrderID = elm.value;
                        break;
                    case "txtCustomerID":
                        CustomerID = elm.value;
                        break;
                    case "txtCompanyName":
                        CompanyName = elm.value;
                        break;
                    case "txtCountry":
                        Country = elm.value;
                        break;
                    case "txtSalesRep":
                        SalesRep = elm.value;
                        break;
                    case "txtShipper":
                        Shipper = elm.value;
                        break;
                }
            }
            else if (elm.type == "hidden")
            {
                switch (elm.id)
                {
                    case "hdnOrderBy":
                        OrderBy = elm.value;
                        break;
                    case "hdnAscDesc":
                        AscDesc = elm.value;
                        break;
                }
            }
            else if (elm.type == "checkbox")
            {
                switch (elm.id)
                {
                    case "chkDisplaySubTotals":
                        DisplaySubtotal = elm.checked ? "1" : "";
                        break;
                    case "chkHideDetails":
                        HideDetails = elm.checked ? "1" : "";
                        break;
                }
            }
        }

        GetJsonData();

    }

    let lnkCSVExport = document.getElementById("lnkCSVExport");
    if (lnkCSVExport) { lnkCSVExport.onclick = lnkCSVExport_onclick; }
    function lnkCSVExport_onclick(e)
    {
        exportTableToCSV("CustomerOrders.csv");
    }

    function download_csv(csv, filename)
    {
        let csvFile;
        let downloadLink;

        csvFile = new Blob([csv], { type: "text/csv" });
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    function exportTableToCSV(filename)
    {
        let csv = [];
        let rows = document.querySelectorAll("table tr");

        for (let i = 0; i < rows.length; i++)
        {
            let row = [], cols = rows[i].querySelectorAll("td, th");

            for (let j = 0; j < cols.length; j++)
                row.push(cols[j].innerText);

            csv.push(row.join(","));
        }

        download_csv(csv.join("\n"), filename);
    }

    return this;
}