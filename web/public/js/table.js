class TablerTable {
    constructor(tableDiv, tableId, columnNames, fieldMapping, route, totalRows, rowsPerPage=20, pageIndex=0, paginationDivId = "paginationDiv") {
        this.tableDiv = tableDiv;
        this.tableId = tableId;
        this.columnNames = columnNames;
        this.fieldMapping = fieldMapping;
        this.route = route;
        this.data = []; // Store the row data
        this.rowsPerPage = rowsPerPage; // Default number of rows per page
        this.pageIndex = pageIndex; // Current page index
        // Pagination will be canceled if pageIndex is explicitly set to -1
        this.noPagination = false;
        if (pageIndex === -1) {
            this.noPagination = true;
            this.pageIndex = 0;
        }
        this.paginationDivId = paginationDivId;
        this.totalRows = totalRows; // Default total number of rows
        if (totalRows > 0)
            this.totalRowsFromQuery = false;
        else
            this.totalRowsFromQuery = true;
    }

    async initialize() {
        await this.createTable();
        await this.fetchPageData();
        await this.createPagination();
    }

    createTable() {
        const table = document.createElement('table');
        table.className = 'table table-vcenter card-table';
        table.id = this.tableId;

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        this.columnNames.forEach(name => {
            const th = document.createElement('th');
            th.textContent = name;
            if (name === '') {
                th.className = 'w-1';
            } else {
                th.addEventListener('click', () => this.sortTable(name));
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        document.getElementById(this.tableDiv).appendChild(table);
    }

    addRows(rowData) {
        this.data = rowData; // Store the row data
        const tbody = document.querySelector(`#${this.tableId} tbody`);
        tbody.innerHTML = ''; // Clear existing rows
        rowData.forEach( (row, index) => {
            const tr = document.createElement('tr');
            let rowContent = '';

            this.columnNames.forEach( columnName => {
                if (columnName === '') {
                    rowContent += '<td></td>'; // Empty cell for the "Edit" column if it existed
                }
                else if (columnName === 'no') {
                    // Put number and direction icon
                    rowContent += `<td>${index + 1}</td>`;
                } 
                else {
                    // Map the column name to the original data field name and get the cell content
                    const fieldName = this.fieldMapping[columnName] || '';
                    //let cellContent = row[fieldName] || 'N/A'; // Use 'N/A' for missing data
                    let cellContent = (fieldName in row) ? row[fieldName] : 'N/A';
                    // Make ',' delimiter for long content
                    cellContent = String(cellContent).replace(/,/g, ', ');
                    rowContent += `<td class="col-min-width" >${cellContent}</td>`;
                }
            });

            tr.innerHTML = rowContent;
            tbody.appendChild(tr);
        });
    }

    sortTable(columnName) {
        const fieldName = this.fieldMapping[columnName] || '';
        const isAscending = this.currentSort === columnName ? !this.isAscending : true;
        this.currentSort = columnName;
        this.isAscending = isAscending;

        this.data.sort((a, b) => {
            const aValue = a[fieldName];
            const bValue = b[fieldName];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                // Numeric sort
                return isAscending ? aValue - bValue : bValue - aValue;
            } else {
                // String sort
                const aString = (aValue || '').toString().toLowerCase();
                const bString = (bValue || '').toString().toLowerCase();

                if (aString < bString) return isAscending ? -1 : 1;
                if (aString > bString) return isAscending ? 1 : -1;
                return 0;
            }
        });

        this.addRows(this.data); // Re-render the rows in sorted order
    }

    async reRender(pageIndex=0) {
        console.log(`Re-render table with pageIndex: ${pageIndex}`);
        // Update rowsPerPage when the select value changes
        this.pageIndex = pageIndex;

        // Fetch data again (it clear existing rows) and create pagination
        await this.fetchPageData();
        await this.createPagination();
    }
    
    createPageList(pageIndex, W, totalPages) {
        const start = Math.max(0, pageIndex - W);
        const end = Math.min(totalPages, pageIndex + W);
        const pageList = Array.from(
            { length: end - start + 1 },
            (_, i) => start + i,
        );
        if (start > 0) {
            pageList.unshift(0); // Add the first page if it's not already included
        }
        if (end < totalPages) {
            pageList.push(totalPages); // Add the last page if it's not already included
        }
        return pageList;
    };

    async createPagination() {
        
        if (this.noPagination)
            return;

        // Container
        // Remove existing pagination container if it exists
        const existingPaginationContainer = document.getElementById(
            "paginationContainer-id",
        );
        if (existingPaginationContainer) {
            existingPaginationContainer.remove();
        }
        // New one
        const paginationContainer = document.createElement("ul");
        paginationContainer.id = "paginationContainer-id";
        paginationContainer.classList.add("pagination");
    
        // Select box for setting number of rows per page: rowsPerPage
        const selectPerPage = document.createElement("select");
        selectPerPage.classList.add("form-select");
        selectPerPage.style.minWidth = "80px";
        selectPerPage.style.fontSize = "0.75rem";
        selectPerPage.addEventListener("change", async (event) => {
            this.rowsPerPage = parseInt(event.target.value);
            this.reRender();
        });
    
        // Options for number of rows per page
        const options = [10, 20, 50, 100];
        options.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.textContent = `${option} satır`;
            optionElement.style.fontSize = "0.75rem";
            selectPerPage.appendChild(optionElement);
        });
    
        // Set the default value of select box to the current rowsPerPage
        selectPerPage.value = this.rowsPerPage;
    
        // Get total number of rows
        const totalPages = Math.ceil(this.totalRows / this.rowsPerPage);
    
        // Append select box to pagination container
        const selectContainer = document.createElement("li");
        selectContainer.appendChild(selectPerPage);
        paginationContainer.appendChild(selectContainer);
    
        // Previous page button
        const prevButton = document.createElement("li");
        prevButton.classList.add("page-item");
        prevButton.innerHTML = `<a class="page-link" href="#" tabindex="-1" aria-disabled="true">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
                              </a>`;
        prevButton.addEventListener("click", async () => {
            if (this.pageIndex > 0) {
                await this.reRender(this.pageIndex - 1);
                //this.pageIndex--;
                //await this.updatePagination();
                //await this.fetchPageData();
            }
        });
    
        paginationContainer.appendChild(prevButton);
    
        // Page numbers
        const pageWindow = 5;
        const pageList = this.createPageList(this.pageIndex, pageWindow, totalPages - 1);
        console.log(this.pageIndex, pageWindow, totalPages, pageList);
        pageList.forEach((i) => {
            const pageButton = document.createElement("li");
            pageButton.classList.add("page-item");
            if (i === this.pageIndex) {
                pageButton.classList.add("active");
            }
            pageButton.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
            pageButton.addEventListener("click", async () => {
                if (i !== this.pageIndex) {
                    const previousActiveButton =
                        document.querySelector(".page-item.active");
                    if (previousActiveButton) {
                        previousActiveButton.classList.remove("active");
                    }
                    await this.reRender(i);
                    //this.pageIndex = i;
                    //await this.createPagination();
                    //await this.fetchPageData();
                    pageButton.classList.add("active"); // Highlight the clicked page number
                }
            });
            paginationContainer.appendChild(pageButton);
        });
        
        // Next page button
        const nextButton = document.createElement("li");
        nextButton.classList.add("page-item");
        nextButton.innerHTML = `<a class="page-link" href="#">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
                                </a>`;
        nextButton.addEventListener("click", async () => {
            if (this.pageIndex < totalPages - 1) {
                await this.reRender(this.pageIndex - 1);
                //this.pageIndex++;
                //await this.updatePagination();
                //await this.fetchPageData();
            }
        });
    
        paginationContainer.appendChild(nextButton);

        // Total Rows
        const label = document.createElement('label');
        label.className = "text-primary";  // Use className to set the class
        label.textContent = `Total: ${this.totalRows}`;  // Use textContent to set the text
        paginationContainer.appendChild(label);
    
        // WARN: paginationDiv hardcoded
        document.getElementById(this.paginationDivId).appendChild(paginationContainer);
    }
    
    // Function to update pagination highlight
    updatePagination() {
        if (this.noPagination)
            return;

        const paginationContainer = document.getElementById(
            "paginationContainer-id",
        );
        const pageButtons = paginationContainer.querySelectorAll(".page-item");
        pageButtons.forEach((button, index) => {
            if (index === this.pageIndex + 1) {
                // +1 to account for the previous button
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    }
        

    async fetchPageData() {
        if (this.rows)
            this.clearRows();
        const offset = this.pageIndex * this.rowsPerPage;

        // fetch data
        let url;
        if (this.route.includes('?')) 
            url = `${this.route}&offset=${offset}&limit=${this.rowsPerPage}`;
        else
            url = `${this.route}?offset=${offset}&limit=${this.rowsPerPage}`;
        const response = await fetch(url);
        const res = await response.json();
        if (this.totalRowsFromQuery) {
            this.addRows(res.data);
            this.totalRows = res.totalcount;
        }
        else {
            // check result
            if (Array.isArray(res)) 
                this.addRows(res);
        }
    }

    clearRows() {
        const table = document.getElementById(this.tableId);
        // Clear all rows from the table
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    }

    getTableData() {
        const table = document.getElementById(this.tableId);
        const rows = [];
    
        // Iterate through each row in the table (excluding the header row)
        for (let i = 1; i < table.rows.length; i++) {
            const row = [];
            const cells = table.rows[i].cells;
            
            // Iterate through each cell in the row
            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                //console.log(cell);  // Log the cell element (for debugging purposes)
                row.push(cell.textContent.trim());  // Add the cell content to the row array, trimmed to remove any excess whitespace
            }
            
            rows.push(row);  // Add the row array to the rows array
        }      
    
        return rows;  // Return the array of rows
    }

    // Function to convert an array of objects to an array of arrays with index
    convertToRowArray(data) {
        return data.map((item, index) => [
            (index + 1).toString(),  // Convert index to string
            ...Object.values(item).map(value => String(value))  // Convert each value to string
        ]);
    }

    async updatePageData() {
        const offset = this.pageIndex * this.rowsPerPage;
    
        // Fetch new data
        let url;
        if (this.route.includes('?')) 
            url = `${this.route}&offset=${offset}&limit=${this.rowsPerPage}`;
        else
            url = `${this.route}?offset=${offset}&limit=${this.rowsPerPage}`;
        
        const response = await fetch(url);
        const res = await response.json();
        
        if (this.totalRowsFromQuery) {
            this.totalRows = res.totalcount; // Update total rows count if needed
        }
        
        // Get the tbody element
        const tbody = document.querySelector(`#${this.tableId} tbody`);
    
        // Check if there are enough rows already
        const existingRows = tbody.querySelectorAll('tr');
        const rowData = res.data || res;
        
        const previousData = this.getTableData(); // Use current table data as previous data
        const currentData = this.convertToRowArray(rowData);

        //console.log('Previous Data:', previousData);
        //console.log('Current Data:', currentData);

        const newPositions = this.calculateRowPositions(previousData, currentData);    
        
        // Update rows with new data and positions
        rowData.forEach((row, index) => {
            let tr;
            if (index < existingRows.length) {
                tr = existingRows[index];
            } else {
                tr = document.createElement('tr');
                tbody.appendChild(tr);
            }
            
            // Determine the position class based on newPositions
            const positionClass = newPositions[index] ? `${newPositions[index]}` : '';
            
            let rowContent = '';
            this.columnNames.forEach((columnName, colIndex) => {
                if (columnName === '') {
                    rowContent += '<td></td>';
                } else if (columnName === 'no') {
                    if (newPositions[index] === 'row-up')
                        rowContent += `<td>🔼 ${index + 1}</td>`;
                    else if (newPositions[index] === 'row-down')
                        rowContent += `<td>🔽 ${index + 1}</td>`;
                    else 
                        rowContent += `<td>${index + 1}</td>`;
                } else {
                    const fieldName = this.fieldMapping[columnName] || '';
                    // Check if the field exists in the row object
                    let cellContent = (fieldName in row) ? row[fieldName] : 'N/A';
                    cellContent = String(cellContent).replace(/,/g, ', ');
                    rowContent += `<td class="col-min-width">${cellContent}</td>`;
                }
            });

            // Apply the position class to the row
            tr.className = positionClass;

            // Update the row content
            tr.innerHTML = rowContent;
        });

        // Remove any extra rows
        for (let i = rowData.length; i < existingRows.length; i++) {
            tbody.removeChild(existingRows[i]);
        }
    }

    calculateRowPositions(previousData, currentData) {
        const positions = {};
        const previousRows = previousData.map(row => Array.isArray(row) ? row[1] : JSON.stringify(row)); // Use the second element (name)
        const currentRows = currentData.map(row => Array.isArray(row) ? row[1] : JSON.stringify(row)); // Use the second element (name)
    
        const rowIndices = {};
    
        // Determine the position of each row in the current data
        previousRows.forEach((name, index) => {
            rowIndices[name] = index;
        });
    
        // Determine the relative positions and use CSS classes
        currentRows.forEach((name, index) => {
            if (name in rowIndices) {
                const preIndex = rowIndices[name];
                if (preIndex < index) {
                    positions[index] = 'row-down'; // Class for up
                } else if (preIndex > index) {
                    positions[index] = 'row-up'; // Class for down
                } else {
                    positions[index] = 'row-same'; // Class for same
                }
            } else {
                positions[index] = 'row-new'; // Class for new
            }
        });
    
        return positions;
    }
    
    
}
