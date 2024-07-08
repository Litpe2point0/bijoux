// "use strict";

// import React, {
//   useCallback,
//   useMemo,
//   useRef,
//   useState,
//   StrictMode,
// } from "react";
// import { createRoot } from "react-dom/client";
// import { AgGridReact } from "ag-grid-react";
// import "@ag-grid-community/styles/ag-grid.css";
// import "@ag-grid-community/styles/ag-theme-quartz.css";
// import {
//   ColDef,
//   ColGroupDef,
//   GridApi,
//   GridOptions,
//   GridReadyEvent,
//   IServerSideDatasource,
//   IServerSideGetRowsRequest,
//   ModuleRegistry,
//   RowModelType,
//   createGrid,
// } from "ag-grid-core";
// import { ServerSideRowModelModule } from "ag-grid-enterprise/server-side-row-model";
// import { IOlympicData } from "./interfaces";
// ModuleRegistry.registerModules([ServerSideRowModelModule]);

// const getServerSideDatasource: (server: any) => IServerSideDatasource = (
//   server: any,
// ) => {
//   return {
//     getRows: (params) => {
//       // adding delay to simulate real server call
//       setTimeout(() => {
//         const response = server.getResponse(params.request);
//         if (response.success) {
//           // call the success callback
//           params.success({
//             rowData: response.rows,
//             rowCount: response.lastRow,
//           });
//         } else {
//           // inform the grid request failed
//           params.fail();
//         }
//       }, 4000);
//     },
//   };
// };

// const getFakeServer: (allData: any[]) => any = (allData: any[]) => {
//   return {
//     getResponse: (request: IServerSideGetRowsRequest) => {
//       console.log(
//         "asking for rows: " + request.startRow + " to " + request.endRow,
//       );
//       // take a slice of the total rows
//       const rowsThisPage = allData.slice(request.startRow, request.endRow);
//       const lastRow = allData.length;
//       return {
//         success: true,
//         rows: rowsThisPage,
//         lastRow: lastRow,
//       };
//     },
//   };
// };

// const Test = () => {
//   const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
//   const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

//   const [columnDefs, setColumnDefs] = useState<ColDef[]>([
//     { field: "country", flex: 4 },
//     { field: "sport", flex: 4 },
//     { field: "year", flex: 3 },
//     { field: "gold", aggFunc: "sum", flex: 2 },
//     { field: "silver", aggFunc: "sum", flex: 2 },
//     { field: "bronze", aggFunc: "sum", flex: 2 },
//   ]);
//   const defaultColDef = useMemo<ColDef>(() => {
//     return {
//       minWidth: 75,
//     };
//   }, []);

//   const onGridReady = useCallback((params: GridReadyEvent) => {
//     fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
//       .then((resp) => resp.json())
//       .then((data: IOlympicData[]) => {
//         // add id to data
//         let idSequence = 0;
//         data.forEach((item: any) => {
//           item.id = idSequence++;
//         });
//         const server: any = getFakeServer(data);
//         const datasource: IServerSideDatasource =
//           getServerSideDatasource(server);
//         params.api!.setGridOption("serverSideDatasource", datasource);
//       });
//   }, []);

//   return (
//     <div style={containerStyle}>
//       <div
//         style={gridStyle}
//         className={
//           "ag-theme-quartz-dark"
//         }
//       >
//         <AgGridReact<IOlympicData>
//           columnDefs={columnDefs}
//           defaultColDef={defaultColDef}
//           rowModelType={"serverSide"}
//           suppressServerSideFullWidthLoadingRow={true}
//           cacheBlockSize={5}
//           maxBlocksInCache={0}
//           rowBuffer={0}
//           maxConcurrentDatasourceRequests={1}
//           blockLoadDebounceMillis={200}
//           onGridReady={onGridReady}
//         />
//       </div>
//     </div>
//   );
// };

// export default Test;