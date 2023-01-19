import React from "react";
import Table from "../components/table/ApplicantsTable";

function Page() {
  return (
    <div className="container overflow-scroll  p-6   mx-auto ">
      <Table
        actions={[
          <button key={1}>View</button>,
          <button key={2}>accept</button>,
        ]}
        columns={["name", "date", "status", "resume"]}
        dataRows={[
          {
            name: "John Doe",
            date: "2020-01-01",
            status: "pending",
            resume: "https://www.google.com",
          },
          {
            name: "John Doe",
            date: "2020-01-01",
            status: "pending",
            resume: "https://www.google.com",
          },
          {
            name: "John Doe",
            date: "2020-01-01",
            status: "pending",
            resume: "https://www.google.com",
          },
        ]}
      />
    </div>
  );
}

export default Page;
