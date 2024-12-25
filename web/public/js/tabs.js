class Tabs {
    constructor(containerId) {
        this.containerId = containerId;
        this.tabs = [];
        this.contentState = {}; // { tabId: { htmlContent: "" } }
        
        this.createTabContainer();

        // Create default two tabs
        this.addTab("tab-settings", "", "", true);
        this.addTab("tab-home", "Home", "");
        this.showTab("tab-home");
    }

    createTabContainer() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error("Container not found");
            return;
        }

        // Create card and card header
        this.card = document.createElement("div");
        this.card.classList.add("card");

        this.cardHeader = document.createElement("div");
        this.cardHeader.classList.add("card-header");

        this.navTabs = document.createElement("ul");
        this.navTabs.classList.add("nav", "nav-tabs", "card-header-tabs");
        this.navTabs.setAttribute("data-bs-toggle", "tabs");

        this.cardHeader.appendChild(this.navTabs);
        this.card.appendChild(this.cardHeader);

        // Create card body
        this.cardBody = document.createElement("div");
        this.cardBody.classList.add("card-body");

        this.tabContent = document.createElement("div");
        this.tabContent.classList.add("tab-content");

        this.cardBody.appendChild(this.tabContent);
        this.card.appendChild(this.cardBody);

        container.appendChild(this.card);
    }

    addTab(id, title, content, hasIcon = false) {
        this.tabs.push({
            id: id,
            title: title,
            content: content,
            isActive: false,
            hasIcon: hasIcon,
        });

        // Create and append tab item
        const navItem = document.createElement("li");
        navItem.classList.add("nav-item");

        let linkHTML = `<a href="#${id}" class="nav-link${this.tabs.find(tab => tab.isActive)?.id === id ? " active" : ""}" data-bs-toggle="tab">${title}</a>`;

        if (hasIcon) {
            linkHTML = `
                <a href="#${id}" class="nav-link" title="${title}" data-bs-toggle="tab">
                    <!-- SVG Icon here -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                    </svg>
                </a>
            `;
        }

        navItem.innerHTML = linkHTML;

        // Append the new tab before the last tab
        const lastNavItem = this.navTabs.querySelector("li:last-child");
        if (lastNavItem) {
            this.navTabs.insertBefore(navItem, lastNavItem);
        } else {
            // If there are no tabs, just append the new tab
            this.navTabs.appendChild(navItem);
        }

        // Initialize content state for new tab
        this.contentState[id] = {
            htmlContent: content
        };

        // Render the new tab content
        this.renderTabContent(id);
    }

    deleteTab(id) {
        // Filter out the tab to delete
        const tabToDelete = this.tabs.find((tab) => tab.id === id);
        if (!tabToDelete) {
            console.error("Tab not found");
            return;
        }
    
        // Remove the tab from the tabs array
        this.tabs = this.tabs.filter((tab) => tab.id !== id);
    
        // Remove the tab from the navigation header
        const navItem = this.navTabs.querySelector(`a[href="#${id}"]`);
        if (navItem) {
            navItem.parentElement.remove(); // Remove the <li> element
        }
    
        // Remove the tab pane content
        const tabPane = document.getElementById(id);
        if (tabPane) {
            tabPane.remove(); // Remove the tab pane element
        }
    
        // Set settings tab as active if it exists, otherwise, choose another tab
        const settingsTab = this.tabs.find((tab) => tab.id === "tab-settings");
        if (settingsTab) {
            this.setActiveTab("tab-settings");
        } else if (this.tabs.length > 0) {
            // If no settings tab, set the first tab as active
            this.setActiveTab(this.tabs[0].id);
        }
    
        // Re-render the active tab's content
        this.showTab(this.tabs.find((tab) => tab.isActive)?.id || this.tabs[0]?.id);
    }
    
    deleteAllTabsExcept(excludeId) {
        // Remove all tabs except the one with excludeId
        this.tabs.forEach(tab => {
            if (tab.id !== excludeId) {
                this.deleteTab(tab.id);
            }
        });
    }

    showTab(id) {
        this.setActiveTab(id);

        // Update tab pane visibility
        this.tabs.forEach((tab) => {
            const tabPane = document.getElementById(tab.id);
            if (tabPane) {
                const tabLink = document.querySelector(`a[href="#${tab.id}"]`);
                if (tabLink) {
                    tabLink.className = `nav-link${tab.isActive ? " active" : ""}`;
                }
                if (tab.isActive) {
                    tabPane.classList.add("active", "show");
                } else {
                    tabPane.classList.remove("active", "show");
                }
            }
        });
    }

    getTabs() {
        return this.tabs;
    }

    addComponentToTab(tabId, htmlContent) {
        const tabIndex = this.tabs.findIndex((tab) => tab.id === tabId);
        if (tabIndex === -1) {
            console.error("Tab not found");
            return;
        }

        const tabPane = document.getElementById(tabId);
        if (tabPane) {
            tabPane.insertAdjacentHTML("beforeend", htmlContent);
            // Update the content state
            this.contentState[tabId] = (this.contentState[tabId] || "") + htmlContent;
        } else {
            console.error("Tab pane not found");
        }
    }

    setActiveTab(id) {
        this.tabs.forEach((tab) => {
            tab.isActive = tab.id === id;
        });
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error("Container not found");
            return;
        }

        container.innerHTML = "";

        this.createTabContainer();
    }

    renderTabContent(tabId) {
        // Check if the tabId is valid
        if (!tabId) {
            console.error("Tab ID is required.");
            return;
        }
    
        // Find the tab object from the tabs array
        const tab = this.tabs.find((tab) => tab.id === tabId);
        if (!tab) {
            console.error("Tab not found.");
            return;
        }
    
        // Find the tab pane element
        const tabPane = document.getElementById(tabId);
        if (tabPane) {
            // Update existing tab pane content
            tabPane.innerHTML = this.contentState[tabId]?.htmlContent || "";
            // Manage active class
            if (tab.isActive) {
                tabPane.classList.add("active", "show");
            } else {
                tabPane.classList.remove("active", "show");
            }
        } else {
            // Create new tab pane if it doesn't exist
            const newTabPane = document.createElement("div");
            newTabPane.classList.add("tab-pane");
            if (tab.isActive) newTabPane.classList.add("active", "show");
            newTabPane.id = tabId;
    
            newTabPane.innerHTML = this.contentState[tabId]?.htmlContent || "";
            this.tabContent.appendChild(newTabPane);
        }
    }
    
}
