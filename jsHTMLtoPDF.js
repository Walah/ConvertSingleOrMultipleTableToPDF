// convertTableToPDF() converts the HTML to PDF using the jsPDF library

// When converting SINGLE table, table header is optional. You can convert a
// table without it's header by passing an empty string array, like []

// However, converting MULTIPLE tables is little different. Each table MUST HAVE a header.
// In other words, the lengths of tableArray[] and tableHeaderArray[] HAVE to match.
//
//     @param {string} fileName - the name of the PDF file
//     @param {string} title - ID of the page title (and sub-title) section
//                             (optional, but have to send an empty string; like '' )
//     @param {string[]} tableArray - ID(s) of the HTML table(s)
//     @param {string[]} tableHeaderArray - ID(s) of the HTML table header(s)
//                                          (for single table with no table header,
//                                          this can be left blank; like [])
//     @param {string} pg_orientation - preferred printing page orientation
//                                      (optional, can be omitted)
//
// Sources: 
//     - https://github.com/simonbengtsson/jsPDF-AutoTable
//     - https://codepen.io/someatoms/pen/adojWy
//     - https://www.codexworld.com/convert-html-to-pdf-using-javascript-jspdf/
//     - https://github.com/simonbengtsson/jsPDF-AutoTable/blob/a35c7a2c18ba4a8f10a7fb420335c05b8824524a/examples/examples.js#L175
//     - https://stackoverflow.com/questions/38787437/different-width-for-each-columns-in-jspdf-autotable

function convertTableToPDF(fileName, title, tableArray, tableHeaderArray, pg_orientation) {
  var doc
  if (pg_orientation == 'landscape') {
    doc = new jsPDF('l', 'pt');
  } else {
    doc = new jsPDF('p', 'pt');
  }

  // If no title is passed, then skip this part
  if (title != '') {
    // Collecting the page title (and sub-title)
    var titleHTML = $('#' + title).html();

    var setPageTitle = function () {
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      doc.fromHTML(titleHTML, 40, 20);
    };
  }

  // Each table has different settings, so creating different
  // options for each table. And then we will use them accordingly
  // General setting for any Report tables
  var generalOtions = {
    didDrawPage: setPageTitle,
    margin: {
      top: 120
    },
    styles: {
      halign: 'center'
    }
  };

  // Balance Report table settings
  var balanceOptions = {
    didDrawPage: setPageTitle,
    margin: {
      top: 125
    },
    tableWidth: 'auto',
    styles: {
      overflow: 'hidden',
      cellWidth: 'wrap',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { cellWidth: 180 }
    }
  };

  // Transaction Report table settings
  var transactionOptions = {
    didDrawPage: setPageTitle,
    margin: {
      top: 120
    },
    willDrawCell: function (data) {
      var rows = data.table.body;
      if ((data.row.index === rows.length - 1) ||
          (data.row.index === rows.length - 3) ||
          (data.row.index === rows.length - 6) ||
          (data.row.index === rows.length - 9)) {
            doc.setFontStyle('bold')
      }
    },
    styles: {
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 100 },
      2: { cellWidth: 100 },
      3: { cellWidth: 200 }
    }
  };

  // Setting the Y position for the first table header
  let tableHeaderPosY = 115;
  var tableHeader, res, previousTable;

  var setTableHeader = function (header, headerPosY) {
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    tableHeader = document.getElementById(header).innerHTML
    doc.text(tableHeader, 40, headerPosY);
  };

  if (tableArray.length >= 1) {
    //// SINGLE Table: Adding the first table (and may be it's header)
    /******************************************************************
    * NOTE: When converting a single table, table header is optional
    *******************************************************************/
    if (tableHeaderArray.length != 0)
    {
      // Get and set the table header
      setTableHeader(tableHeaderArray[0], tableHeaderPosY)
    }
    // Collect the table data
    res = doc.autoTableHtmlToJson(document.getElementById(tableArray[0]));

    // Combining page title, sub-title, table, table header, and customized table settings
    if (fileName == 'Balance_Report') {
      doc.autoTable(res.columns, res.data, balanceOptions);
    } else if (fileName == 'Transaction_Report_AA') {
      doc.autoTable(res.columns, res.data, transactionOptions);
    } else {
      doc.autoTable(res.columns, res.data, generalOtions);
    }

    //// MULTIPLE Tables: If there are more tables, add them here
    /******************************************************************
    * Note: When handling multiple tables, each table NEEDS a header
    *******************************************************************/
    if (tableArray.length > 1) {
      // When converting multiple tables and every tables
      // don't have headers, notify the developer.
      if (tableArray.length != tableHeaderArray.length)
        alert("ERROR!!! \nWe do not have the same number of tables and table headers. " +
              "Make sure you are passing same number of tabes and headers from the function call.");

      for (var i = 1; i < tableArray.length; i++) {
        // Tracking the Y position of previous table (so we can add margin between tables)
        previousTable = doc.autoTable.previous.finalY;
        // Set next header's position based on the last table's Y position
        tableHeaderPosY = (previousTable + 35);

        // Get and set the table header
        setTableHeader(tableHeaderArray[i], tableHeaderPosY)
        // Collect the table data
        res = doc.autoTableHtmlToJson(document.getElementById(tableArray[i]));

        // Add 45 margin between tables
        if (fileName == 'Balance_Report') {
          doc.autoTable(res.columns, res.data,
            {
              startY: previousTable + 45,
              styles: {
                overflow: 'hidden',
                cellWidth: 'wrap',
                halign: 'center'
              },
              columnStyles: {
                0: { cellWidth: 110 },
                1: { cellWidth: 180 }
              }
            }
          );
        }
        else {
          doc.autoTable(res.columns, res.data,
            {
              startY: previousTable + 45
            }
          );
        }
      }
    }
  } else {
    alert("ERROR!!! \nYou forgot to pass the table ID(s) in array.");
  }

  // Add footer
  doc.setFontSize(9);
  doc.setTextColor(40);
  doc.setFontStyle('normal');
  doc.text( '©  Blah blah blah',
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 60,
            null, null, "center" );

  // Download the PDF file
  doc.save(fileName + ".pdf");
}
