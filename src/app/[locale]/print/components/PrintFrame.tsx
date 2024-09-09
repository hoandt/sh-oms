import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useRef } from "react";

const PrintPDF = () => {
  const iframeRef = useRef(null);
  const [display, setDisplay] = React.useState(false);
  const pdfUrl =
    "https://swifthubfiles.onpoint.vn/order/2024/09/09/15619236UG2LLJYMRS3H7SYMYF5XY42P_shipping_label.pdf";

  const displayPDF = () => {
    setDisplay(true);
    if (iframeRef.current) {
      const iframe = iframeRef.current as HTMLIFrameElement;
      iframe.style.display = "block"; // Make the iframe visible
      iframe.src = pdfUrl; // Set the src to the pdf url
    }
  };

  return (
    <div>
      <Button onClick={displayPDF}>Print Label</Button>
      <Dialog open={display} onOpenChange={() => setDisplay((prev) => !prev)}>
        <DialogContent>
          <iframe
            src={pdfUrl}
            style={{
              width: "100%",
              height: "500px",
              border: "none",
            }}
            title="PDF Viewer"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrintPDF;
