import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFoundPage from "./components/NotFoundPage";
import { observer } from "mobx-react";
import HomePage from "./components/HomePage";
import ReadmePage from "./components/ReadmePage";
import { AppContextProvider } from "./components/AppContext";

function App() {
  return (
    <Router>
      <AppContextProvider>
        {" "}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/repository/:owner/:repo" element={<ReadmePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppContextProvider>
    </Router>
  );
}

export default observer(App);
