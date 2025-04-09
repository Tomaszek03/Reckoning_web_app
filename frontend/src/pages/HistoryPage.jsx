import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function History() {
  const [history, setHistory] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const fetchData = async () => {
    const response = await fetch("http://localhost:5000/history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const formattedData = data.map((item) => ({
      id: item[0],
      total_amount: item[1],
      date: item[2],
    }));

    setHistory(formattedData);
    console.log(formattedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      calculateMonthlyTotal();
    }
  }, [history]);

  const calculateMonthlyTotal = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyData = history.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    });

    const total = monthlyData.reduce((acc, item) => acc + item.total_amount, 0);
    setMonthlyTotal(total);
  };

  return (
    <>
      <div className="container mt-4">
        <div className="header">History od purchases</div>
        <h5>Monthly summary: {monthlyTotal} zł</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Total</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>
                  {item.total_amount
                    ? item.total_amount + " zł"
                    : "Invalid data"}
                </td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default History;
