# ConvertSingleOrMultipleTableToPDF

For one of my projects, I had to export HTML table to a PDF file with 

- page title
- table
- table header
- disclaimer footnote

Eventually the following requirements came along:

- not all the single table will have table header
- need to export multiple tables **with** their headers
- a few tables might need to be exported in landscape page orientation
- all the tables have specific names, so the PDF file should use that name

After some googling I found out that the [jsPDF autotable plugin](https://github.com/simonbengtsson/jsPDF-AutoTable)
will be the easiest way to achieve my goals. 

In my example, the `convertTableToPDF()` has the following parameters:

- `{string} fileName` - the name of the PDF file
- `{string} title` - ID of the page title (and sub-title) section (_optional, but **have to** send an empty string; like ''_ )
- `{string[]} tableArray` - ID(s) of the HTML table(s)
- `{string[]} tableHeaderArray` - ID(s) of the HTML table header(s) (_for **single table** with no table header, this can be left blank; like []_)
- `{string} pg_orientation` - preferred printing page orientation (_optional, can be omitted_)

Feel free to use and modify this solution as needed. I do understand that there are a lot of ways to improve this function, but this was the quickest solution I could come up with for my project (for now). For example, I'm not happy the way I had to create [different table options](https://github.com/Walah/ConvertSingleOrMultipleTableToPDF/blob/master/jsHTMLtoPDF.js#L46) for each of my tables, would appreciate if someone can come up with a better solution :) 
