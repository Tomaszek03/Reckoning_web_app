import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/PriceTable.css";
import axios from "axios";

function PriceTable() {
  const [prices, setPrices] = useState([]);
  const [newPrice, setNewPrice] = useState("");
  const [names, setNames] = useState(["Name1", "Name2", "Name3"]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState("");
  const [totalValueCalculated, setTotalValueCalculated] = useState(0);
  const [submit, setSubmit] = useState(null);
  const [userTotal, setUserTotal] = useState({});

  const addRow = () => {
    if (newPrice === "" || isNaN(newPrice) || parseFloat(newPrice) <= 0) {
      setError("Please enter a valid number for the price.");
      return;
    }

    setError("");
    setPrices([
      ...prices,
      {
        price: parseFloat(newPrice),
        checked: new Array(names.length).fill(false),
      },
    ]);
    setNewPrice("");
  };

  const addColumn = () => {
    const newName = prompt("Enter new name:");
    if (newName) {
      setNames([...names, newName]);
      setPrices(
        prices.map((row) => ({
          ...row,
          checked: [...row.checked, false],
        }))
      );
    }
  };

  const removeRow = (index) => {
    const newPrices = prices.filter((_, rowIndex) => rowIndex !== index);
    setPrices(newPrices);
  };

  const removeColumn = (index) => {
    setNames(names.filter((_, colIndex) => colIndex !== index));
    setPrices(
      prices.map((row) => {
        const updatedRow = { ...row };
        updatedRow.checked = row.checked.filter(
          (_, colIndex) => colIndex !== index
        );
        return updatedRow;
      })
    );
  };

  const handleCheckboxChange = (rowIndex, colIndex) => {
    const newPrices = [...prices];
    newPrices[rowIndex].checked[colIndex] =
      !newPrices[rowIndex].checked[colIndex];
    setPrices(newPrices);
  };

  const calculateCosts = () => {
    const totals = {};

    names.forEach((name) => {
      totals[name] = 0;
    });

    prices.forEach((row) => {
      const involved = row.checked
        .map((checked, index) => (checked ? names[index] : null))
        .filter(Boolean);

      if (involved.length === 0) return;

      const share = row.price / involved.length;
      involved.forEach((name) => {
        totals[name] += share;
      });
    });

    setUserTotal(totals);

    const totalPrice = prices.reduce((acc, row) => acc + row.price, 0);
    const totalValue = parseFloat(total);

    const roundedTotalValue = Math.round(totalValue * 100) / 100;
    const roundedTotalPrice = Math.round(totalPrice * 100) / 100;

    setTotalValueCalculated(roundedTotalPrice);

    if (isNaN(roundedTotalValue)) {
      setSubmit(null);
    } else if (roundedTotalValue > roundedTotalPrice) {
      setSubmit(1);
    } else if (roundedTotalValue < roundedTotalPrice) {
      setSubmit(2);
    } else {
      setSubmit(0);
      saveToDB(roundedTotalValue);
    }
  };

  const saveToDB = async (totalAmount) => {
    try {
      const response = await axios.post("http://localhost:5000/save", {
        total_amount: totalAmount,
      });
      console.log("Total saved to DB:", totalAmount);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="container mt-4">
      <input
        type="number"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
        className="form-control mb-3"
        placeholder="Full amount for purchases"
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Remove</th>
            <th>Price</th>
            {names.map((name, idx) => (
              <th key={idx}>
                {name}
                <button
                  onClick={() => removeColumn(idx)}
                  className="btn btn-danger btn-sm ms-2"
                >
                  ✖
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {prices.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              <td className="centered-cell">
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => removeRow(rowIndex)}
                >
                  ✖
                </button>
              </td>
              <td>
                <input
                  type="number"
                  value={row.price}
                  disabled
                  className="form-control"
                />
              </td>
              {row.checked.map((isChecked, colIndex) => (
                <td className="checkbox-cell" key={colIndex}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(rowIndex, colIndex)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addRow();
              }
            }}
            className="form-control"
            placeholder="Enter price"
          />
          {error && <div className="text-danger mt-1 fw-bold">{error}</div>}
        </div>
        <div className="col-md-8 d-flex align-items-start gap-2">
          <button className="btn btn-primary" onClick={addRow}>
            Add Price
          </button>
          <button className="btn btn-secondary" onClick={addColumn}>
            Add Person
          </button>
          <button className="btn btn-success" onClick={calculateCosts}>
            Calculate
          </button>
        </div>
      </div>

      {submit !== null && (
        <div className="alert alert-info">
          {submit === 1 && (
            <p>
              Total is greater than the sum of prices (
              {totalValueCalculated.toFixed(2)} PLN).
            </p>
          )}
          {submit === 2 && (
            <p>
              Total is less than the sum of prices (
              {totalValueCalculated.toFixed(2)} PLN).
            </p>
          )}
          {submit === 0 && <p>Total matches the sum of prices.</p>}
        </div>
      )}

      {Object.keys(userTotal).length > 0 && (
        <div className="summary">
          <h5>Individual Costs:</h5>
          <ul>
            {Object.entries(userTotal).map(([name, total]) => (
              <li key={name}>
                {name}: {total.toFixed(2)} PLN
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PriceTable;
