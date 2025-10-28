import React, { useEffect, useState } from "react";

const API_KEY =
  "aHRVZ3pFcDl2dmtFMDJzdkV1Wms2QjNZUHRFV1dsSzhpR2VZd29KcQ==";
const API_BASE = "https://api.countrystatecity.in/v1";

const LocationPicker = ({ onChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [loading, setLoading] = useState(false);

  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const [searchCountry, setSearchCountry] = useState("");
 


  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/countries`, {
        headers: { "X-CSCAPI-KEY": API_KEY },
      });
      const json = await res.json();
      setCountries(json);
    } catch (err) {
      alert("Error", "Failed to load countries");
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async (countryCode) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/countries/${countryCode}/states`,
        {
          headers: { "X-CSCAPI-KEY": API_KEY },
        }
      );
      const json = await res.json();
      setStates(json);
    } catch (err) {
      alert("Error", "Failed to load states");
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async (countryCode, stateCode) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/countries/${countryCode}/states/${stateCode}/cities`,
        {
          headers: { "X-CSCAPI-KEY": API_KEY },
        }
      );
      const json = await res.json();
      setCities(json);
    } catch (err) {
      alert("Error", "Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCountry) {
      setStates([]);
      setCities([]);
      setSelectedState("");
      setSelectedCity("");
      fetchStates(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setCities([]);
      setSelectedCity("");
      fetchCities(selectedCountry, selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      const countryName =
        countries.find((c) => c.iso2 === selectedCountry)?.name || "";
      const stateName =
        states.find((s) => s.iso2 === selectedState)?.name || "";
      const cityName = selectedCity;
      onChange({ country: countryName, state: stateName, city: cityName });
    }
  }, [selectedCity]);

  const renderModal = (visible, setVisible, data, onSelect, title, searchable = false) => {
    const filteredData =
      searchable && searchCountry
        ? data.filter((item) =>
            item.name.toLowerCase().includes(searchCountry.toLowerCase())
          )
        : data;

    if (!visible) return null;

    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContainer}>
          <h3 style={styles.modalTitle}>{title}</h3>

          {searchable && (
            <input
              style={styles.searchInput}
              placeholder="Search..."
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
            />
          )}

          <div style={styles.listContainer}>
            {filteredData.map((item, index) => (
              <div
                key={index}
                style={styles.option}
                onClick={() => {
                  onSelect(item);
                  setVisible(false);
                }}
              >
                <span style={styles.optionText}>{item.name}</span>
              </div>
            ))}
          </div>
          <button
            style={styles.closeButton}
            onClick={() => setVisible(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>Select Country:</label>
      <div
        style={styles.selector}
        onClick={() => setShowCountryModal(true)}
      >
        {selectedCountry
          ? countries.find((c) => c.iso2 === selectedCountry)?.name
          : "-- Select Country --"}
      </div>

      {selectedCountry && (
        <>
          <label style={styles.label}>Select State:</label>
          <div
            style={styles.selector}
            onClick={() => setShowStateModal(true)}
          >
            {selectedState
              ? states.find((s) => s.iso2 === selectedState)?.name
              : "-- Select State --"}
          </div>
        </>
      )}

      {selectedState && (
        <>
          <label style={styles.label}>Select City:</label>
          <div
            style={styles.selector}
            onClick={() => setShowCityModal(true)}
          >
            {selectedCity || "-- Select City --"}
          </div>
        </>
      )}

      {loading && (
        <div style={styles.loading}>Loading...</div>
      )}

      {renderModal(showCountryModal, setShowCountryModal, countries, (item) =>
        setSelectedCountry(item.iso2), "Select Country", true)}

      {renderModal(showStateModal, setShowStateModal, states, (item) =>
        setSelectedState(item.iso2), "Select State")}

      {renderModal(showCityModal, setShowCityModal, cities, (item) =>
        setSelectedCity(item.name), "Select City")}
    </div>
  );
};

export default LocationPicker;

const styles = {
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: "#500013",
    marginBottom: 5,
    fontWeight: "500",
  },
  selector: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #FF6B7A",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    cursor: "pointer",
  },
  loading: {
    marginTop: 10,
    color: "#FF6B7A",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxWidth: 400,
    maxHeight: 600,
    overflowY: "auto",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  searchInput: {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  listContainer: {
    maxHeight: 400,
    overflowY: "auto",
  },
  option: {
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#FF6B7A",
    color: "#fff",
    border: "none",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    cursor: "pointer",
    width: "100%",
  },
};
