import Layout from "./components/layout";

function App() {
  return (
    <Layout
      header={
        <div className="flex h-full w-full">
          <div className="max-w-5 h-full flex-1 border p-2"></div>
        </div>
      }
      actions={<div></div>}
      output={<div></div>}
      footer={<div></div>}
    ></Layout>
  );
}

export default App;
