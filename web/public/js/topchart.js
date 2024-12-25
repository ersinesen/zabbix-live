class TopChart {
    constructor(tableDiv, tableId, columnNames, fieldMapping, route, totalRows, rowsPerPage=20, pageIndex=0, refreshInterval=30000) {
        this.tableDiv = tableDiv;
        this.tableId = tableId;
        this.columnNames = columnNames;
        this.fieldMapping = fieldMapping;
        this.route = route;
        this.totalRows = totalRows;
        this.rowsPerPage = rowsPerPage;
        this.pageIndex = pageIndex;
        this.refreshInterval = refreshInterval; // Interval for data fetching in milliseconds
        this.fetchIntervalId = null; // To store the interval ID
        
        this.table = new TablerTable(tableDiv, tableId, columnNames, fieldMapping, route, totalRows, rowsPerPage, pageIndex);
    }

    async initialize() {
        await this.table.initialize(); // Initialize the table
        this.startFetching(); // Start periodic data fetching
    }

    async updateData() {
        try {
            this.table.updatePageData();
        } catch (error) {
            console.error("Failed to update data:", error);
        }
    }

    startFetching() {
        this.fetchIntervalId = setInterval(() => {
            this.updateData(); // Fetch data periodically
        }, this.refreshInterval);
    }

    stop() {
        // Clear the fetch interval if it exists
        if (this.fetchIntervalId !== null) {
            clearInterval(this.fetchIntervalId);
            this.fetchIntervalId = null;
        }

        // Optionally, you may want to clean up the table if it has cleanup methods
        // For example:
        // if (this.table && typeof this.table.cleanup === 'function') {
        //     this.table.cleanup();
        // }

        console.log(`Stopped fetching and cleaned up TopChart instance with tableId: ${this.tableId}`);
    }
}

