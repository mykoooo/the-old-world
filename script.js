window.addEventListener("scroll", () => {
    document.documentElement.style.setProperty(
    "--scroll",
    window.scrollY / (document.body.offsetHeight - window.innerHeight)
    );

    const mainSection = document.getElementById("main-section");
    const mainHeight = mainSection.offsetHeight - 50;
    const currentScroll = window.scrollY;
    const navbar = document.getElementById("navbar");
    
    if (currentScroll > (mainHeight)) {
        navbar.classList.add("visible");
    } else {
        navbar.classList.remove("visible");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const raceListContainer = document.getElementById("race-list");
    const raceDetailsContainer = document.getElementById("race-details");
    const raceSearchInput = document.getElementById("race-search");

    var allRaces = [];

    async function fetchRaces() {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");

            const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
            };

            const response = await fetch("https://www.dnd5eapi.co/api/races", requestOptions)
            const data = await response.json();

            allRaces = data.results;
            displayRaceList(allRaces);
        } catch (error) {
            console.error("Error loading race list:", error);
            raceListContainer.innerHTML = `<p class="error">Failed to load races. Please try again later.</p>`;
        }
    }

    function displayRaceList(races) {
        raceListContainer.innerHTML = `<ul>${races
        .map(
            (race) =>
            `<li class="list-item" data-url="${race.url}">
                ${race.name}
            </li>`
        )
        .join("")}
        </ul>`;
    
        // Add click event listeners for each race
        document.querySelectorAll("#race-list .list-item").forEach((item) => {
            item.addEventListener("click", () => {
                fetchRaceDetails(item.getAttribute("data-url"));
                
                if (window.matchMedia("(max-width: 1023px)").matches) {
                    const classDetails = document.querySelector("#race-details");
                    if (classDetails) {
                        const offset = classDetails.offsetTop - 140;
                        window.scrollTo({
                            top: offset,
                            behavior: "smooth",
                        });
                    }
                }
            });
        });
    }

    async function fetchRaceDetails(url) {
        try {
            raceDetailsContainer.innerHTML = `<p class="loading">Loading race details...</p>`;
    
            // Fetch the race data
            const response = await fetch(`https://www.dnd5eapi.co${url}`);
            const raceData = await response.json();
    
            // Display the race details
            displayRaceDetails(raceData);
        } catch (error) {
            console.error("Error loading race details:", error);
            raceDetailsContainer.innerHTML = `<p class="error">Failed to load race details. Please try again later.</p>`;
        }
    }
    
    //Construct Race Details
    async function displayRaceDetails(race) {
        const raceImages = {
            "dragonborn":"https://www.dndbeyond.com/avatars/thumbnails/6/340/420/618/636272677995471928.png",
            "dwarf": "https://www.dndbeyond.com/avatars/thumbnails/6/254/420/618/636271781394265550.png",
            "elf": "https://www.dndbeyond.com/avatars/thumbnails/7/639/420/618/636287075350739045.png",
            "gnome": "https://www.dndbeyond.com/avatars/thumbnails/6/334/420/618/636272671553055253.png",
            "half-elf": "https://www.dndbeyond.com/avatars/thumbnails/6/481/420/618/636274618102950794.png",
            "half-orc": "https://www.dndbeyond.com/avatars/thumbnails/6/466/420/618/636274570630462055.png",
            "halfling": "https://www.dndbeyond.com/avatars/thumbnails/6/256/420/618/636271789409776659.png",
            "human": "https://www.dndbeyond.com/avatars/thumbnails/6/258/420/618/636271801914013762.png",
            "tiefling": "https://www.dndbeyond.com/avatars/thumbnails/7/641/420/618/636287076637981942.png"
        };
        const raceImage = raceImages[race.name.toLowerCase()];
        raceDetailsContainer.innerHTML = `
            <img src="${raceImage}" alt="${race.name} image" class="race-image">
            <h2>${race.name}</h2>
            <div class = "gen-desc">
                <p><strong>Speed:</strong> ${race.speed}</p>
                <p><strong>Alignment:</strong> ${race.alignment}</p>
                <p><strong>Age:</strong> ${race.age}</p>
                <p><strong>Size:</strong> ${race.size} (${race.size_description})</p>
                <p><strong>Languages:</strong> ${race.languages.map((lang) => lang.name).join(", ")}</p>
            
            ${
                race.language_desc
                ? `<p><strong>Language Details:</strong> ${race.language_desc}</p>`
                : ""
            }
            </div>
            ${
                race.traits.length > 0
                ? `<hr><h4>Traits:</h4>
                    <ul id="traits-list">
                    </ul>`
                : ""
            }
        `;
    
        // Fetch details for each trait
        try {
            const traitPromises = race.traits.map((trait) =>
                fetch(`https://www.dnd5eapi.co${trait.url}`).then((res) => res.json())
            );
    
            const traitDetails = await Promise.all(traitPromises);
    
            // Add trait descriptions to the page
            const traitsList = document.querySelector("#traits-list");
            traitDetails.forEach((trait) => {
                const traitItem = document.createElement("li");
                traitItem.classList.add("list-desc");
                traitItem.innerHTML = `<strong>${trait.name}:</strong> ${trait.desc || "No description available"}`;
                traitsList.appendChild(traitItem);
            });
        } catch (error) {
            console.error("Error loading trait details:", error);
            const traitsList = document.querySelector("#traits-list");
            traitsList.innerHTML = "<li>Error loading trait descriptions. Please try again later.</li>";
        }
    }
    
    raceSearchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
    
        // If search term is empty, show all races
        if (searchTerm.trim() === "") {
            displayRaceList(allRaces);
        } else {
            const filteredRaces = allRaces.filter((race) =>
                race.name.toLowerCase().includes(searchTerm)
            );
            displayRaceList(filteredRaces);
        }
    });
    

    const classListContainer = document.getElementById("class-list");
    const classDetailsContainer = document.getElementById("class-details");
    const classSearchInput = document.getElementById("class-search");

    var allClasses = [];

    async function fetchClasses() {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");

            const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
            };

            const response = await fetch("https://www.dnd5eapi.co/api/classes", requestOptions)
            const data = await response.json();

            allClasses = data.results;
            displayClassList(allClasses);
        } catch (error) {
            console.error("Error loading classes:", error);
            classListContainer.innerHTML = `<p class="error">Failed to load classes. Please try again later.</p>`;
        }
    }

    function displayClassList(classes) {
        classListContainer.innerHTML = `<ul>${classes
        .map(
            (classItem) => `
                <li class="class-item" data-url="${classItem.url}" data-index="${classItem.index}">
                    ${classItem.name}
                </li>`
        )
        .join("")}
        </ul>
        `;
        // Add click event listeners for each class item
        const classItems = document.querySelectorAll(".class-item");
        classItems.forEach((item) =>
            item.addEventListener("click", () => {
                const url = item.dataset.url;
                const index = item.dataset.index;
                fetchClassDetails(url, index);

                if (window.matchMedia("(max-width: 1023px)").matches) {
                    const classDetails = document.querySelector("#class-details");
                    if (classDetails) {
                        const offset = classDetails.offsetTop - 140;
                        window.scrollTo({
                            top: offset,
                            behavior: "smooth",
                        });
                    }
                }
            })
        );
    }

    // Add search functionality
    classSearchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();

        // If search term is empty, show all classes
        if (searchTerm.trim() === "") {
            displayClassList(allClasses);
        } else {
            const filteredClasses = allClasses.filter((classItem) =>
                classItem.name.toLowerCase().includes(searchTerm)
            );
            displayClassList(filteredClasses);
        }
    });
    
    async function fetchClassDetails(url, index) {
        try {
            classDetailsContainer.innerHTML = "<p class='loading'>Loading class details...</p>";
    
            // Fetch the main class data
            const classResponse = await fetch(`https://www.dnd5eapi.co${url}`);
            const classData = await classResponse.json();
    
            // Fetch additional details: starting equipment and features
            const [equipmentData, featuresData] = await Promise.all([
                fetch(`https://www.dnd5eapi.co/api/classes/${index}/starting-equipment`).then((res) => res.json()),
                fetch(`https://www.dnd5eapi.co/api/classes/${index}/features`).then((res) => res.json())
            ]);
    
            // Fetch details for each feature
            const featurePromises = featuresData.results.map((feature) =>
                fetch(`https://www.dnd5eapi.co${feature.url}`).then((res) => res.json())
            );
    
            const featureDetails = await Promise.all(featurePromises);
    
            // Display the fetched details
            displayClassDetails(classData, equipmentData, featureDetails);
        } catch (error) {
            console.error("Error fetching class details:", error);
            classDetailsContainer.innerHTML = "<p class='error'>Failed to load class details. Please try again later.</p>";
        }
    }    

    // Construct the class details
    function displayClassDetails(classData, equipmentData, featureDetails) {
        const classImages = {
            "barbarian": "https://www.dndbeyond.com/avatars/thumbnails/6/342/420/618/636272680339895080.png",
            "bard": "https://www.dndbeyond.com/avatars/thumbnails/6/369/420/618/636272705936709430.png",
            "cleric": "https://www.dndbeyond.com/avatars/thumbnails/6/371/420/618/636272706155064423.png",
            "druid": "https://www.dndbeyond.com/avatars/thumbnails/6/346/420/618/636272691461725405.png",
            "fighter": "https://www.dndbeyond.com/avatars/thumbnails/6/359/420/618/636272697874197438.png",
            "monk": "https://www.dndbeyond.com/avatars/thumbnails/6/489/420/618/636274646181411106.png",
            "paladin": "https://www.dndbeyond.com/avatars/thumbnails/6/365/420/618/636272701937419552.png",
            "ranger": "https://www.dndbeyond.com/avatars/thumbnails/6/367/420/618/636272702826438096.png",
            "rogue": "https://www.dndbeyond.com/avatars/thumbnails/6/384/420/618/636272820319276620.png",
            "sorcerer": "https://www.dndbeyond.com/avatars/thumbnails/6/485/420/618/636274643818663058.png",
            "warlock": "https://www.dndbeyond.com/avatars/thumbnails/6/375/420/618/636272708661726603.png",
            "wizard": "https://www.dndbeyond.com/avatars/thumbnails/6/357/420/618/636272696881281556.png"
        };
        const classImage = classImages[classData.name.toLowerCase()];
        classDetailsContainer.innerHTML = `
            <img src="${classImage}" alt="${classData.name} image" class="class-image">
            <h2>${classData.name}</h2>
            <div class="gen-desc">
            <p><strong>Hit Die:</strong> d${classData.hit_die}</p>
            <h3>Proficiencies:</h3>
            <ul>
                ${classData.proficiencies
                .map((proficiency) => `<li>${proficiency.name}</li>`)
                .join("")}
            </ul>
            <p><strong>Saving Throws:</strong> ${classData.saving_throws
                .map((save) => save.name)
                .join(", ")}</p>
            ${
                classData.subclasses.length > 0
                ? `<p><strong>Subclass/es:</strong> ${classData.subclasses
                    .map((subclass) => subclass.name)
                    .join(", ")}</p>`
                : ""
            }
            <h3>Starting Equipment:</h3>
            <ul>
                ${equipmentData.starting_equipment
                .map((item) => `<li>${item.equipment.name} x${item.quantity}</li>`)
                .join("")}
            </ul>
            ${
                equipmentData.starting_equipment_options.length > 0
                ? `<h3>Equipment Options:</h3>
                    <ul>
                        ${equipmentData.starting_equipment_options
                            .map((option) => {
                                // Return just the desc from each starting equipment option
                                return `<li>${option.desc}</li>`;
                            })
                            .join("")}
                    </ul>`
                : ""
            }
            </div>
            <hr><h4>Class Features:</h4>
            <ul>
                ${featureDetails
                .map(
                    (feature) => `
                    <li class="list-desc">
                        <strong>${feature.name}:</strong> ${feature.desc.join(" ")}
                    </li>
                    `
                )
                .join("")}
            </ul>
        `;
    }

    const spellListContainer = document.getElementById("spell-list");
    const spellDetailsContainer = document.getElementById("spell-details");
    const searchInput = document.getElementById("search");

    var allSpells = []; // Store all spells for resetting the list

    // Fetch the spells from the API
    async function fetchSpells() {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");

            const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
            };

            const response = await fetch("https://www.dnd5eapi.co/api/spells", requestOptions);
            const data = await response.json();

            allSpells = data.results; // Store all spells for later use
            displaySpells(allSpells); // Populate the list initially
        } catch (error) {
            console.error("Error fetching spells:", error);
            spellListContainer.innerHTML = `<p class="error">Error loading spells. Please try again later.</p>`;
        }
    }

    // Display spells in the list
    function displaySpells(spells) {
        if (!spells || spells.length === 0) {
            spellListContainer.innerHTML = "<p>No spells found.</p>";
            return;
        }

        spellListContainer.innerHTML = `<ul> ${spells
                .map(
                (spell) => `
                <li data-url="${spell.url}">${spell.name}</li>
            `
                )
                .join("")}
            </ul>`;
            const spellItems = document.querySelectorAll("#spell-list li");
            spellItems.forEach((item) =>
                item.addEventListener("click", () => {
                    fetchSpellDetails(item.dataset.url);

                    if (window.matchMedia("(max-width: 1023px)").matches) {
                        const classDetails = document.querySelector("#spell-details");
                        if (classDetails) {
                            const offset = classDetails.offsetTop - 140;
                            window.scrollTo({
                                top: offset,
                                behavior: "smooth",
                            });
                        }
                    }
                })
        );
    }

    // Fetch spell details
    async function fetchSpellDetails(spellUrl) {
        try {
            spellDetailsContainer.innerHTML = "<p class='loading'>Loading spell details...</p>";

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");

            const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
            };

            const response = await fetch(`https://www.dnd5eapi.co${spellUrl}`, requestOptions);
            const spell = await response.json();

            displaySpellDetails(spell);
        } catch (error) {
            console.error("Error fetching spell details:", error);
            spellDetailsContainer.innerHTML = "<p>Error loading spell details. Please try again later.</p>";
        }
    }

    // Search functionality
    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();

        if (searchTerm === "") {
            // If search term is blank, reset to all spells
            displaySpells(allSpells);
        } else {
            // Filter spells by the search term
            const filteredSpells = allSpells.filter((spell) =>
            spell.name.toLowerCase().includes(searchTerm)
            );
            displaySpells(filteredSpells);
        }
    });

    function displaySpellDetails(spell) {
        let descriptionHtml = spell.desc
            .map((text) => {
                if (text.startsWith("| Size |")) {
                    return convertMarkdownTableToHtml(spell.desc);
                } else if (text.startsWith("|")) {
                    return; // Skip the table header if necessary
                } else {
                    // Check for the asterisks surrounding the special options
                    // RegEx to match any text wrapped in *** like ***Aquatic Adaptation***
                    const formattedText = text.replace(/\*\*\*(.*?)\*\*\*/g, "<strong>$1</strong>");
    
                    if (formattedText.startsWith("#")) {
                        return `<h4>${formattedText.replace(/^#+\s*/, "")}</h4>`;
                    } else {
                        return `<p>${formattedText}</p>`;
                    }
                }
            })
            .join("");
    
        spellDetailsContainer.innerHTML = `
            <h2>${spell.name}</h2>
            <hr>
            <div class="gen-desc">
            <p><strong>Level:</strong> ${spell.level > 0 ? spell.level : "cantrip"}</p>
            <p><strong>School:</strong> ${spell.school.name}</p>
            <p><strong>Range:</strong> ${spell.range}</p>
            <p><strong>Casting Time:</strong> ${spell.casting_time}</p>
            <p><strong>Duration:</strong> ${spell.duration}</p>
            </div>
            <hr>
            <div>${descriptionHtml}</div>
            ${
                spell.higher_level && spell.higher_level.length > 0
                    ? `<div><strong>At Higher Levels:</strong> ${spell.higher_level
                        .map((hl) => `<p>${hl}</p>`)
                        .join("")}</div>`
                    : ""
            }
        `;
    }    

    // Function to convert markdown-style tables to HTML tables
    function convertMarkdownTableToHtml(descArray) {
        const tableStartIndex = descArray.findIndex((line) => line.startsWith("| Size |"));
        const tableEndIndex = descArray.findIndex((line, i) => i > tableStartIndex && !line.startsWith("|"));

        if (tableStartIndex === -1) return "";

        const tableLines = descArray.slice(tableStartIndex, tableEndIndex);
        const header = tableLines[0]
        .split("|")
        .slice(1, -1)
        .map((cell) => `<th>${cell.trim()}</th>`)
        .join("");
        const rows = tableLines
        .slice(2)
        .map((line) =>
            `<tr>${line
            .split("|")
            .slice(1, -1)
            .map((cell) => `<td>${cell.trim()}</td>`)
            .join("")}</tr>`
        )
        .join("");

        return `
        <div class="table-container">
            <table>
                <thead><tr>${header}</tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
        `;
    }
    //Initialize fetching
    fetchRaces();
    fetchClasses();
    fetchSpells();
});