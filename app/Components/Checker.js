"use client"
import React, { useState } from "react";

export default function Checker() {
  const [websiteLink, setWebsiteLink] = useState("");
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPerformanceStyle = (percentage) => {
    let bgColor, borderColor, textColor, borderWidth;

    if (percentage >= 0 && percentage < 50) {
      bgColor = "rgb(247, 79, 79)"; // Light Red for 0-49%
      borderColor = "red";
      textColor = "white";
      borderWidth = "10px";
    } else if (percentage >= 50 && percentage < 80) {
      bgColor = "yellow"; // Yellow for 50-79%
      borderColor = "darkorange";
      textColor = "black";
      borderWidth = "8px";
    } else {
      bgColor = "green"; // Green for 80-100%
      borderColor = "forestgreen";
      textColor = "white";
      borderWidth = "6px";
    }

    return { backgroundColor: bgColor, borderColor, color: textColor, borderWidth };
  };
  const handleSubmit = async () => {
    if (!websiteLink) {
      alert("Link is Required");
      return;
    }






    try {
      setLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${websiteLink}&key=AIzaSyCCLJbFPkdNZOCajAMroS9fp8_vm65uQFc`
      );

      if (response.ok) {
        const data = await response.json();
        setLoading(false);
        console.log("All data", data);
        console.log("loadingExperience=====", data.loadingExperience
        );
        formatTime(data.lighthouseResult.timing.total)
        console.log("Light house=====", data.lighthouseResult);
        setPerformanceData(data);
      } else {
        console.error("Error fetching performance data");
        alert("Add valid URL")
        setPerformanceData(null);
        setLoading(false);
        return
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setPerformanceData(null);
    }finally{
      setLoading(false)
    }
  };



  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    const ms = milliseconds % 1000;
  
    return `${hours}h ${minutes}m ${seconds}s ${ms}ms`;
  };


  return (
    <div className="min-h-screen  justify-center md:p-3 p-3  lg:p-20">
      <div>
        <div className="flex justify-between gap-3 flex-wrap">
<div>

        <h3 className=" text-orange-500 text-xl font-bold mb-2 tracking-wide">
         Fetch Time:  {performanceData && performanceData.lighthouseResult.fetchTime }
        </h3>
</div>
        <div className="  text-sm">
        🟥 0 - 49% &nbsp;&nbsp;&nbsp;&nbsp; 🟨 50 - 79% &nbsp;&nbsp;&nbsp;&nbsp;🟩 80 - 100%
      </div>
        </div>
        <div className="my-[3vh] flex gap-5">
          <input
            required
            className="shadow  border rounded-[12px] text-xl lg:w-[100vh] md:w-[100%] w-[100%] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="https://example.com"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
          />
          <div className="text-center"></div>
          <button
          disabled={loading}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold  px-[32px] rounded-lg focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Analyze
          </button>
        </div>

        {loading ? (
          <div className=" justify-center">
            <div className="flex justify-center">
              <div class="spin">
                <div class="inner"></div>
              </div>
            </div>
            <div className="text-center mt-1 text-orange-500">Analyzing...</div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="performance-details">
              {performanceData && (
                <>
                  <div
                    className="p-5 w-[25vh] h-[25vh] mt-9 flex justify-center border-[red] border-y-8 items-center rounded-full text-white text-2xl font-bold"
                    style={getPerformanceStyle(
                      performanceData.lighthouseResult.categories.performance.score * 100
                    )}
                  >
                    {performanceData.lighthouseResult.categories.performance.score * 100} %
                  </div>
                  <div className="text-white text-sm ml-5">Performance</div>

                  <br/>   
                  <h1><span className="font-bold"> Over All category :</span> {performanceData.loadingExperience.overall_category}</h1>

                  <br/>   
                  <h1><span className="font-bold"> Total Load Time: </span> {formatTime(performanceData.lighthouseResult.timing.total)}</h1>
                  
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
