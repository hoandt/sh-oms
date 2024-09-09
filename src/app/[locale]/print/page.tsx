"use client";
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import PrintPDF from "./components/PrintFrame";

const QrCodeGenerator = () => {
  // State for input values
  const [content, setContent] = useState<string>("hello\nworld");
  const [columns, setColumns] = useState<number>(2);
  const [rows, setRows] = useState<number>(64);
  const [align, setAlign] = useState<string>("left");
  const [verticalAlign, setVerticalAlign] = useState<string>("top");
  const [cellMargin, setCellMargin] = useState<number>(0);
  const [CellPadding, setCellPadding] = useState<number>(0);
  const [borderStyle, setBorderStyle] = useState<string>("dotted");
  const [borderThickness, setBorderThickness] = useState<number>(1);
  const [fixedWidth, setFixedWidth] = useState<number>(0);
  const [fixedHeight, setFixedHeight] = useState<number>(0);
  const [paperWidth, setPaperWidth] = useState<number>(210); // Default A4 width
  const [paperHeight, setPaperHeight] = useState<number>(297); // Default A4 height
  //paper padding
  const [paperPadding, setPaperPadding] = useState<number>(0);

  const qrValues = content.split("\n").filter((line) => line.trim() !== "");

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  // Save settings to local storage
  const saveSettings = () => {
    localStorage.setItem(
      "qrCodeSettings",
      JSON.stringify({
        content,
        columns,
        rows,

        align,
        verticalAlign,
        cellMargin,
        CellPadding,
        borderStyle,
        borderThickness,
        fixedWidth,
        fixedHeight,
        paperWidth,
        paperHeight,
        paperPadding,
      })
    );
  };

  // Clear settings from local storage and reset state
  const clearSettings = () => {
    localStorage.removeItem("qrCodeSettings");
    setContent("hello\nworld");
    setColumns(1);
    setRows(64);

    setAlign("left");
    setVerticalAlign("top");
    setCellMargin(0);
    setCellPadding(0);
    setBorderStyle("dotted");
    setBorderThickness(1);
    setFixedWidth(0);
    setFixedHeight(0);
    setPaperWidth(210);
    setPaperHeight(297);
  };

  // Load settings from local storage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("qrCodeSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setContent(settings.content);
      setColumns(settings.columns);
      setRows(settings.rows);

      setAlign(settings.align);
      setVerticalAlign(settings.verticalAlign);
      setCellMargin(settings.cellMargin);
      setCellPadding(settings.cellPadding);
      setBorderStyle(settings.borderStyle);
      setBorderThickness(settings.borderThickness);
      setFixedWidth(settings.fixedWidth);
      setFixedHeight(settings.fixedHeight);
      setPaperWidth(settings.paperWidth);
      setPaperHeight(settings.paperHeight);
    }
  }, []);

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printArea, #printArea * {
            visibility: visible;
          }
          #printArea {
            position: absolute;
            top: 0;
            left: 0;
            width: ${paperWidth}mm;
            height: ${paperHeight}mm;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background-color: #fff; /* Background color for print area */
          }
        }

        @media screen {
          #printArea {
            border: 2px dashed red; /* Add a border to visually indicate the print area size */
            width: ${paperWidth}mm;
            height: ${paperHeight}mm;
            margin: 0 auto; /* Center on screen */
            padding: ${paperPadding}px; /* Add padding to the print area */
            box-sizing: border-box;
          }
        }
      `}</style>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 print:hidden">
          QR Code Printer
        </h1>
        <div className="flex ">
          <div className="mb-4 min-w-96 bg-slate-100 border rounded px-4 py-8">
            <label className="block mb-2 font-semibold">
              Content (Each line is a value):
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={6}
              placeholder="Enter each value on a new line"
            />
            {/* Settings Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                {
                  label: "Columns count per page",
                  value: columns,
                  setter: setColumns,
                },
                { label: "Size", value: rows, setter: setRows },

                {
                  label: "Cell Margin",
                  value: cellMargin,
                  setter: setCellMargin,
                },
                {
                  label: "Cell Padding",
                  value: CellPadding,
                  setter: setCellPadding,
                },

                {
                  label: "Paper Padding (px)",
                  value: paperPadding,
                  setter: setPaperPadding,
                },

                {
                  label: "Paper Width (mm)",
                  value: paperWidth,
                  setter: setPaperWidth,
                },
                {
                  label: "Paper Height (mm)",
                  value: paperHeight,
                  setter: setPaperHeight,
                },
                {
                  label: "Border Thickness (px)",
                  value: borderThickness,
                  setter: setBorderThickness,
                },
              ].map(({ label, value, setter }, index) => (
                <div key={index}>
                  <label className="block mb-2 font-semibold">{label}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setter(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="0"
                  />
                </div>
              ))}
              <div>
                <label className="block mb-2 font-semibold">
                  Vertical Align:
                </label>
                <select
                  value={verticalAlign}
                  onChange={(e) => setVerticalAlign(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="top">Top</option>
                  <option value="middle">Middle</option>
                  <option value="bottom">Bottom</option>
                </select>
                <hr />
              </div>
              {/* separator horizontal line */}
              <hr className="w-full my-2" />
              <hr className="w-full my-2" />

              <div>
                <label className="block mb-2 font-semibold">
                  Border Style:
                </label>
                <select
                  value={borderStyle}
                  onChange={(e) => setBorderStyle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Align:</label>
                <select
                  value={align}
                  onChange={(e) => setAlign(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 bg-gray-100">
              <button
                onClick={saveSettings}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Save Settings
              </button>
              <button
                onClick={clearSettings}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Clear Settings
              </button>
              <button
                onClick={handlePrint}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Print
              </button>
            </div>
          </div>
          {/* Display QR Codes */}
          <div
            id="printArea"
            className="grid grid-cols-1  p-0 bg-white"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, auto)`,
              gap: `${cellMargin}px`,
            }}
          >
            {qrValues.map((value, index) => (
              <div
                key={index}
                className={
                  // check align and vertical align then set the class
                  align === "center" && verticalAlign === "middle"
                    ? "flex justify-center items-center"
                    : align === "center" && verticalAlign === "top"
                    ? "flex justify-center items-start"
                    : align === "center" && verticalAlign === "bottom"
                    ? "flex justify-center items-end"
                    : align === "left" && verticalAlign === "middle"
                    ? "flex justify-start items-center"
                    : align === "left" && verticalAlign === "top"
                    ? "flex justify-start items-start"
                    : align === "left" && verticalAlign === "bottom"
                    ? "flex justify-start items-end"
                    : align === "right" && verticalAlign === "middle"
                    ? "flex justify-end items-center"
                    : align === "right" && verticalAlign === "top"
                    ? "flex justify-end items-start"
                    : align === "right" && verticalAlign === "bottom"
                    ? "flex justify-end items-end"
                    : "flex justify-center items-center"
                }
                style={{
                  borderColor: borderThickness > 0 ? "black" : "transparent",
                  borderWidth: `${borderThickness}px`,
                  borderStyle: borderStyle,
                  textAlign: align as "center" | "left" | "right",
                  justifyContent: align,
                  alignItems: verticalAlign,
                  width: fixedWidth > 0 ? `${fixedWidth}px` : "auto",
                  height: fixedHeight > 0 ? `${fixedHeight}px` : "auto",
                  padding: `${CellPadding}px`,
                }}
              >
                <div className="flex flex-col">
                  <QRCodeSVG value={value} width={rows} height={rows} />

                  <p className="font-mono text-center">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default QrCodeGenerator;
