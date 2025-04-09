import PriceTable from "../components/PriceTable";

function Calculate() {
  return (
    <>
      <div className="header">Settle purchases</div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-8">
            <PriceTable />
          </div>
        </div>
      </div>
    </>
  );
}

export default Calculate;
