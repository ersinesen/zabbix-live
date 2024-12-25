// Global tabs object
let tabs = null;

// Default notifyhub server url
let NOTIFYHUB_URL = `ws://localhost:40101`;


document.addEventListener("DOMContentLoaded", async function () {
  // Create tabs object
  tabs = new Tabs("tabs-container");

  // Add additional content to the Home tab
  const hometabId = "tab-home";
  
  const tableId = `${hometabId}-table`;
  const table = new JTabula(hometabId, 5, tableId);
  table.createTable();
  /* For test:
  const cell = {
    type: "chart",
    chartType: "line",
    chartTitle: "Data",
    series: [
      {
        data: [1, 2, 3, 4, 3, 2, 1],
      },
    ],
  };
  table.appendCell(cell);
  */
  if (!tabs.tables) tabs.tables = {};
  tabs.tables[hometabId] = table;

  // Get notifyhubserver url
  await fetch('/api/notifyhub')
  .then((response) => response.json())
  .then((data) => {
    NOTIFYHUB_URL = `${data.NOTIFYHUB_URL}`;
    //console.log(NOTIFYHUB_URL);
  })
  .catch((error) => {
    console.error('Error fetching environment variable NOTIFYHUB_URL:', error);
  });

  // Call this function to add the components to the Settings tab
  initSettings(tabs);
});

// Function to initialize settings tab and event listeners
function initSettings(tabs) {
  const settingsTabId = "tab-settings";

  // HTML content to add input fields for Tab Name and Cells Per Row
  const settingsHtml = `
    <div class="container-xl">
      <div class="row row-cards">
        <div class="col-md-4">
          <div class="card">
            <div class="card-header card-header-loadpatrol">
              <h4>Add Tab</h4>
            </div>
            <div class="card-body">
              <div class="settings-form">
                <table class="table card-table table-vcenter">
                  <tbody>
                    <tr>
                      <td><label for="tabName">Tab Name</label></td>
                      <td><input type="text" id="tabName" placeholder="Enter tab name" /></td>
                    </tr>
                    <tr>
                      <td><label for="cellsPerRow">Cells Per Row</label></td>
                      <td><input type="number" id="cellsPerRow" placeholder="5" /></td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <button class="add-tab btn btn-primary btn-sm btn-sqr">Add</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-header card-header-loadpatrol">
              <h4>Delete Tab</h4>
            </div>
            <div class="card-body">
              <table class="table card-table table-vcenter">
                <tbody>
                  <tr>
                    <td><label for="tabSelector">Select Tab</label></td>
                    <td><select id="tabSelector" class="my-select"></select></td>
                  </tr>
                </tbody>
              </table>
              <br />
              <button class="delete-tab btn btn-danger btn-sm btn-sqr">Delete</button>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-header card-header-loadpatrol">
              <h4>Session</h4>
            </div>
            <div class="card-body">
              <table class="table card-table table-vcenter">
                <tbody>
                  <tr>
                    <td><label for="sessionAction">Select Action</label></td>
                    <td>
                      <select id="sessionAction" class="my-select">
                        <option value="save">Save current layout</option>
                        <option value="load">Load saved layout</option>
                        <option value="clear">Clear current layout</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <button class="btn btn-secondary btn-sm btn-sqr" onclick="sessionAction()" >Do</button>
            </div>
          </div>
        </div>

      </div>
      <br />
      <div class="row row-cards">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header card-header-loadpatrol">
              <h4>Insert Live Chart</h4>
            </div>
            <div class="card-body">
              <table class="table card-table table-vcenter">
                <tbody>
                  <tr>
                    <td><label for="boxName">Chart Name</label></td>
                    <td><input type="text" id="boxName" placeholder="Enter chart name" /></td>
                  </tr>
                  <tr>
                    <td><label for="tabSelectorInsert">Tab</label></td>
                    <td><select id="tabSelectorInsert" class="my-select"></select></td>
                  </tr>
                  <tr>
                    <td><label for="hostSelector">Host</label></td>
                    <td><select id="hostSelector" class="my-select"></select></td>
                  </tr>
                  <tr>
                    <td><label for="itemSelector">Item</label></td>
                    <td>
                      <select id="itemSelector" class="my-select">
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><label for="typeSelector">Type</label></td>
                    <td>
                      <select id="typeSelector" class="my-select my-select">
                        <option value="bar">Bar</option>
                        <option value="line">Line</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <button class="insert-box btn btn-secondary btn-sm btn-sqr">Insert</button>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header card-header-loadpatrol">
              <h4>Insert History Chart</h4>
            </div>
            <div class="card-body">
              <table class="table card-table table-vcenter">
                <tbody>
                  <tr>
                    <td><label for="boxNameHistory">Chart Name</label></td>
                    <td><input type="text" id="boxNameHistory" placeholder="Enter chart name" /></td>
                  </tr>
                  <tr>
                    <td><label for="tabSelectorInsertHistory">Tab</label></td>
                    <td><select id="tabSelectorInsertHistory" class="my-select"></select></td>
                  </tr>
                  <tr>
                    <td><label for="hostSelectorHistory">Host</label></td>
                    <td><select id="hostSelectorHistory" class="my-select"></select></td>
                  </tr>
                  <tr>
                    <td><label for="itemSelectorHistory">Item</label></td>
                    <td>
                      <select id="itemSelectorHistory" class="my-select">
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><label for="typeSelectorHistory">Type</label></td>
                    <td>
                      <select id="typeSelectorHistory" class="my-select my-select">
                        <option value="bar">Bar</option>
                        <option value="line">Line</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><input placeholder="Start" class="form-check-description w-50" type="text" id="datetimePicker1" data-enable-time="true"></td>
                    <td><input placeholder="End" class="form-check-description w-50" type="text" id="datetimePicker2" data-enable-time="true"></td>
                  </tr>
                </tbody>
              </table>
              <br />
              <button class="insert-box-history btn btn-secondary btn-sm btn-sqr">Insert</button>
            </div>
          </div>
        </div>
      </div>
      <br />
      
      </div>
    </div>
  `;

  tabs.addComponentToTab(settingsTabId, settingsHtml);

  // Fill hosts from backend
  fetchHosts();

  // Event listener for hostSelector change
  const hostSelector = document.getElementById('hostSelector');

  // Add an event listener for the 'change' event
  hostSelector.addEventListener('change', (event) => {
    // Get the selected option value
    const selectedValue = event.target.value;

    // Get the selected option text
    const selectedText = event.target.options[event.target.selectedIndex].text;

    // Log the selected value and text (or perform any other action)
    //console.log(`Host id: ${selectedValue} - Host name: ${selectedText}`);

    // Fetch items for the selected host
    fetchItems(selectedValue);
  });

  // Event listener for hostSelector change
  const hostSelectorHistory = document.getElementById('hostSelectorHistory');

  // Add an event listener for the 'change' event
  hostSelectorHistory.addEventListener('change', (event) => {
    // Get the selected option value
    const selectedValue = event.target.value;

    // Get the selected option text
    const selectedText = event.target.options[event.target.selectedIndex].text;

    // Log the selected value and text (or perform any other action)
    console.log(`Host id: ${selectedValue} - Host name: ${selectedText}`);

    // Fetch items for the selected host
    fetchItems(selectedValue, chart="historychart");
  });  

  // Create datetime pickers
  flatpickr("#datetimePicker1", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: true,
  });
  flatpickr("#datetimePicker2", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      time_24hr: true,
  });
  flatpickr("#datetimePicker3", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: true,
  });
  flatpickr("#datetimePicker4", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: true,
  });

  // Event delegation for dynamically added content
  document.addEventListener("click", async (event) => {
    if (event.target && event.target.classList.contains("add-tab")) {
      console.log("add-tab clicked.");
      const tabName = document.getElementById("tabName").value;
      const cellsPerRow = document.getElementById("cellsPerRow").value;

      if (tabName.trim() === "") {
        alert("Tab Name cannot be empty");
        return;
      }

      // Create a new tab
      const newTabId = `tab-${tabName.replace(/\s+/g, "-")}`;
      tabs.addTab(newTabId, tabName, "");

      //tabs.showTab(newTabId);

      // Update the tab selectors
      updateTabSelector();
      updateTabSelector("tabSelectorInsert");
      updateTabSelector("tabSelectorInsertHistory");

    } else if (event.target && event.target.classList.contains("delete-tab")) {
      const selectedTabId = document.getElementById("tabSelector").value;

      if (selectedTabId) {
        // Delete the selected tab: first clean up JTabula for graceful destroying cell elements
        if (tabs.tables[selectedTabId]) {
          tabs.tables[selectedTabId].deleteCells();
          delete tabs.tables[selectedTabId];
        }
        tabs.deleteTab(selectedTabId);

        // Update the tab selector
        updateTabSelector();
        updateTabSelector("tabSelectorInsert");
        updateTabSelector("tabSelectorInsertHistory");

      } else {
        alert("Please select a tab to delete");
      }
    } 
    else if (event.target && event.target.classList.contains("insert-box")) {
      //console.log("insert-box called.");
      const selectedTabId = document.getElementById("tabSelectorInsert").value;

      if (selectedTabId) {
        //console.log(selectedTabId);
        // Insert a new box into the selected tab
        const boxName = document.getElementById("boxName").value;
        const chartType = document.getElementById("typeSelector").value;
        const channel = getChannelName();
        
        const cell = {
          type: "livechart",
          chartType: chartType,
          chartTitle: boxName,
          websocketurl: NOTIFYHUB_URL,
          channel: channel,
          maxY: null,
          labels: null,
          series: [
            {
              data: [],
            },
          ],
        };

        // Create jtabula if not already
        if (!tabs.tables[selectedTabId]) {
          const tableId = `${selectedTabId}-table`;
          const numCols = document.getElementById("cellsPerRow").value
            ? Number(document.getElementById("cellsPerRow").value)
            : 5;
          console.log(
            `Table creation: ${selectedTabId} - ${tableId} - ${numCols}`,
          );
          const table = new JTabula(selectedTabId, numCols, tableId);
          table.createTable();
          table.appendCell(cell);
          tabs.tables[selectedTabId] = table;
        } else {
          tabs.tables[selectedTabId].appendCell(cell);
        }

        // Open the tab
        tabs.showTab(selectedTabId);
      } else {
        alert("Please select a tab to insert box.");
      }
    } 
    else if (event.target && event.target.classList.contains("insert-box-history")) {
      console.log("insert-box-history called.");
      const selectedTabId = document.getElementById("tabSelectorInsertHistory").value;
      const start_time = document.getElementById('datetimePicker1').value;
      const end_time = document.getElementById('datetimePicker2').value;
      //console.log(start_time, end_time);

      if (selectedTabId) {
        // Insert a new history box into the selected tab
        const boxName = document.getElementById("boxNameHistory").value;
        const chartType = document.getElementById("typeSelectorHistory").value;
        const selectElement = document.getElementById("itemSelectorHistory");
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const item = selectedOption.dataset.index;

        // fetch data from backend
        const series = await fetchHistoryData(item,  start_time, end_time);

        const cell = {
          type: "echart",
          name: boxName,
          chartType: chartType,
          title: boxName,
          width: 800,
          height: 400,
          series: series,
        };

        // Create jtabula if not already
        if (!tabs.tables[selectedTabId]) {
          const tableId = `${selectedTabId}-table`;
          const numCols = document.getElementById("cellsPerRow").value
            ? Number(document.getElementById("cellsPerRow").value)
            : 5;
          console.log(
            `Table creation: ${selectedTabId} - ${tableId} - ${numCols}`,
          );
          const table = new JTabula(selectedTabId, numCols, tableId);
          table.createTable();
          table.appendCell(cell);
          tabs.tables[selectedTabId] = table;
        } else {
          tabs.tables[selectedTabId].appendCell(cell);
        }

        // Open the tab
        tabs.showTab(selectedTabId);
      } else {
        alert("Please select a tab to insert box.");
      }
    }

  });

  // Function to update the tab selector options
  function updateTabSelector(id = "tabSelector") {
    const tabSelector = document.getElementById(id);
    tabSelector.innerHTML = ""; // Clear existing options

    // Populate tabSelector with all tabs from tabs.getTabs()
    tabs.getTabs().forEach((tab) => {
      if (tab.id !== settingsTabId) {
        //console.log(tab.id);
        // Exclude settings tab
        const option = document.createElement("option");
        option.value = tab.id;
        option.textContent = tab.title;
        tabSelector.appendChild(option);
      }
    });
  }

  // Initial population of the tab selector
  updateTabSelector();
  updateTabSelector("tabSelectorInsert");
  updateTabSelector("tabSelectorInsertHistory");
  
}

// Fetch host list from backend and insert into select
async function fetchHosts() {
  try {
    const response = await fetch("/api/zabbix/hosts");

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const hosts = await response.json();

    // Get the select element
    const selectElement = document.getElementById("hostSelector");
    const selectElementHistory = document.getElementById("hostSelectorHistory");

    // Clear existing options
    selectElement.innerHTML = "";
    selectElementHistory.innerHTML = "";

    // Populate the select element
    hosts.forEach(host => {
      // Create a new option element
      const option = document.createElement("option");
      option.value = host.hostid; // Set the value to host id
      option.textContent = `${host.host}`; // Set the text content to include name and items

      // Append the option to the select element
      selectElement.appendChild(option);

      // Create a new option element
      const option2 = document.createElement("option");
      option2.value = host.hostid; // Set the value to host id
      option2.textContent = `${host.host}`; // Set the text content to include name and items

      // Append the option to the select element
      selectElementHistory.appendChild(option2);
      
    });

  } catch (error) {
    console.error("There was an error:", error);
  }
}

// Fetch items data from backend and insert into select
async function fetchItems(hostid, chart="livechart") {
  try {
    const response = await fetch(`/api/zabbix/host/items?hostid=${hostid}`);

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const items = await response.json();

    // Get the select element
    let selectElement = null;
    if (chart === "livechart") {
      selectElement = document.getElementById("itemSelector");
    }
    else if (chart === "historychart") {
      selectElement = document.getElementById("itemSelectorHistory");
    }

    // Clear existing options
    selectElement.innerHTML = "";

    // Populate the select element
    items.forEach(item => {
      // Create a new option element
      const option = document.createElement("option");

      // Set value to 'itemid'  
      option.value = `${item.itemid}`;

      // Set text content to 'name'
      option.textContent = `${item.name}`;

      // Set custom attributes for name and index
      option.dataset.name = `${item.name}`;
      option.dataset.index = `${item.itemid}`;

      // Append the option to the select element
      selectElement.appendChild(option);      
    });

  } catch (error) {
    console.error("There was an error:", error);
  }
}



function getChannelName() {
  // Get the select element
  const selectElement = document.getElementById("itemSelector");

  // Get the selected option element
  const selectedOption = selectElement.options[selectElement.selectedIndex];

  // Extract name and field index from dataset and value
  const channel = selectedOption.dataset.index;

  return channel;
}

async function fetchHistoryData(item, startTime, endTime) {
  // Construct the query parameters
  const params = new URLSearchParams({
    itemid: item
  });

  // Add start_time and end_time only if they are not null
  if (startTime) {
    // convert starttime to unix timestamp
    const startTimestamp = new Date(startTime).getTime() / 1000;
    params.append('t1', startTimestamp);
  }
  if (endTime) {
    // convert endtime to unix timestamp
    const endTimestamp = new Date(endTime).getTime() / 1000;
    params.append('t2', endTimestamp);
  }

  try {
    // Fetch data from the backend
    const url = `/api/zabbix/item/history?${params.toString()}`;
    console.log(url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse JSON response
    const values = await response.json();
    let dates = [];
    let data = []
    values.forEach(value => {
      const d = new Date(value.clock * 1000).toISOString();
      dates.push(d);
      data.push(value.value);
    });

    const result = {name:  `${item}`, date: dates, data: data};
    // Return the fetched data
    return result;
  } catch (error) {
    console.error('Error fetching series data:', error);
    throw error;
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
  let expires = "";
  if (days !== undefined) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  } else {
      // If no days parameter is provided, assume deletion
      expires = "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to clear the layout in the cookie
function clearLayoutCookie() {
  // Get the current userName from the cookie
  const userName = getCookie('userName');
  if (!userName) {
      console.error('No userName cookie found.');
      return;
  }
  
  // Create the updated layout data with an empty layout
  const layoutData = {
      userName: userName,
      layout: "{}" // Set layout to empty JSON
  };
  
  // Convert to JSON string
  const layoutJson = JSON.stringify(layoutData);

  // Store the updated data in the cookie
  setCookie('loadpatrolLayout', layoutJson, 7); // Set for 7 days or as needed
}


function sessionAction() {
  const action = document.getElementById("sessionAction").value;
  console.log(`Session Action: ${action}`);

  switch (action) {
    case "save":
      // For each tab serialize
      const serializeJson = Object.values(tabs.tables)
        .map(el => {
            try {
                return el.serialize(); // Serialize each element
            } catch (error) {
                console.error('Serialization error for element:', el, error);
                return null; // Return undefined if serialization fails
            }
        })
        .filter(serialized => serialized !== null); // Exclude null values
      console.log(serializeJson);
      const concatenatedJson = serializeJson.join('|'); // Use a delimiter that won't appear in your JSON
      console.log('Concatenated JSON:', concatenatedJson);
      
      // Read the userName cookie
      const userName = getCookie('userName');
      // Create the layout data with userName and concatenated JSON
      const layoutData = `${userName}|${concatenatedJson}`;

      // Set the loadpatrolLayout cookie with the JSON string
      setCookie('loadpatrolLayout', layoutData, 7);
      break;
    
    case "clear":
      const consent = confirm("Are you sure to delete current session layout?")
      if (consent) {
        clearLayoutCookie();
        // Reset tabs
        resetTabs();
        console.log("Cookie 'loadpatrolLayout' has been reset.");
      }
      break;

    case "load":
      // Reset tabs
      resetTabs();
      console.log("Layout loaded from the cookie 'loadpatrolLayout'.");
      break;
    
  }
  
}

// Function to reset tabs based on the saved layout in the cookie
function resetTabs() {
  // Read and parse the loadpatrolLayout cookie
  const layoutJson = getCookie('loadpatrolLayout');
  if (!layoutJson) {
      console.warn('No layout data found in cookie');
      return;
  }

  // Split the cookie value to extract userName and tab layouts
  const [userName, ...tabLayouts] = layoutJson.split('|');

  if (!userName) {
      console.error('No userName found in cookie');
      //return;
  }

  // Delete all JTabula tables
  Object.keys(tabs.tables).forEach(tabId => {
    const table = tabs.tables[tabId];
    if (table) {
        table.deleteCells(); // Call deleteCells to handle cleanup
        delete tabs.tables[tabId]; // Remove table from tabs.tables
    }
  });

  // Delete all tabs except "tab-settings"
  tabs.deleteAllTabsExcept("tab-settings");

  // Check if the tabLayouts array is empty
  if (tabLayouts.length === 0 || (tabLayouts.length === 1 && tabLayouts[0].trim() === '')) {
      console.log('No tabs to restore');
      return;
  }

  // Add tabs from the cookie
  tabLayouts.forEach(tabLayout => {
      try {
          console.log(tabLayout);
          // Deserialize each tab layout
          const tabData = JSON.parse(tabLayout);

          // Assuming tabData contains the necessary properties
          const containerId = tabData.containerId;
          const numCols = tabData.columnsPerRow;
          const tableId = tabData.tableID;

          // We need to deduce title from containerId
          // TODO: save it in cookies in addition to jtabula serialization
          const title = containerId.replace("tab-","");

          // Add the tab
          tabs.addTab(containerId, title, "");

          // Initialize the table
          const table = new JTabula(containerId, numCols, tableId);
          table.createTable();
          table.deserialize(tabLayout);

          tabs.tables[containerId] = table;
      } catch (e) {
          console.error('Error processing tab layout:', e);
      }
  });
}
