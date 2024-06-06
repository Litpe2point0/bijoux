// import React, { useState } from "react";
// import Pagination from "./Items Card Widget/Pagination";
// import ModelBanner from "./Items Card Widget/ModelBanner";





// const Model_Page = () => {
//   const [itemsPerPage, setItemsPerPage] = useState(4);
//   const itemsPerPageFromBanner = (itemsPerPage) => {
//     setItemsPerPage(itemsPerPage);
//   };

//   return (
//     <div className="max-w-container mx-auto px-4">
//       <div className="w-full h-full flex pb-20 gap-10">

//         <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
//           <ModelBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />

//           <Pagination itemsPerPage={itemsPerPage} />
//         </div>
//       </div>
//       {/* ================= Products End here ===================== */}
//     </div>



import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
  CButton,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react'
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import { get_account_list } from "../../api/accounts/Account_Api";
import Pagination from "./Items Card Widget/Pagination";
import ModelBanner from "./Items Card Widget/ModelBanner";
import { useNavigate } from "react-router-dom";


const data = {
  "model_available": [
    {
      "id": 1,
      "name": "Classic Ring",
      "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
      "mounting_type": {
        "id": 1,
        "name": "Prong"
      },
      "mounting_style": {
        "id": 1,
        "name": "Solitaire"
      },
      "base_width": 2.0,
      "base_height": 1.5,
      "volume": 1.5,
      "production_price": 500.00,
      "profit_rate": 0.2,
      "model_diamond_shape": [
        {
          "model_id": 1,
          "diamond_shape": {
            "id": 1,
            "name": "Round",
            "drawing_path": "https://example.com/shapes/round.svg"
          }
        },
        {
          "model_id": 1,
          "diamond_shape": {
            "id": 2,
            "name": "Princess",
            "drawing_path": "https://example.com/shapes/princess.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 1,
          "model_id": 1,
          "diamond_size_min": 0.5,
          "diamond_size_max": 2.0,
          "count": 1,
          "diamond_shape": {
            "id": 1,
            "name": "Round",
            "drawing_path": "https://example.com/shapes/round.svg"
          },
          "Is_editable": true
        },
        {
          "id": 2,
          "model_id": 1,
          "diamond_size_min": 0.5,
          "diamond_size_max": 2.0,
          "count": 1,
          "diamond_shape": {
            "id": 2,
            "name": "Princess",
            "drawing_path": "https://example.com/shapes/princess.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 1,
          "model_id": 1,
          "metal": {
            "id": 1,
            "name": "Gold",
            "buy_price_per_gram": 50.00,
            "sale_price_per_gram": 60.00,
            "imageUrl": "https://example.com/metals/gold.jpg",
            "specific_weight": 19.32,
            "deactivated": 0,
            "created": "2024-05-20T08:30:00.000Z"
          },
          "is_main": true,
          "percentage": 90
        },
        {
          "id": 2,
          "model_id": 1,
          "metal": {
            "id": 2,
            "name": "Platinum",
            "buy_price_per_gram": 70.00,
            "sale_price_per_gram": 80.00,
            "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
            "specific_weight": 21.45,
            "deactivated": 0,
            "created": "2024-05-21T09:00:00.000Z"
          },
          "is_main": false,
          "percentage": 10
        }
      ],
      "isAvailable": true,
      "deactivated": 1
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/test/1716385601.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    },
    {
      "id": 2,
      "name": "Modern Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 2,
        "name": "Bezel"
      },
      "mounting_style": {
        "id": 2,
        "name": "Halo"
      },
      "base_width": 3.0,
      "base_height": 2.0,
      "volume": 2.5,
      "production_price": 700.00,
      "profit_rate": 0.3,
      "model_diamond_shape": [
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          }
        },
        {
          "model_id": 2,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 3,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 3,
            "name": "Oval",
            "drawing_path": "https://example.com/shapes/oval.svg"
          },
          "Is_editable": true
        },
        {
          "id": 4,
          "model_id": 2,
          "diamond_size_min": 0.7,
          "diamond_size_max": 1.5,
          "count": 1,
          "diamond_shape": {
            "id": 4,
            "name": "Cushion",
            "drawing_path": "https://example.com/shapes/cushion.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 3,
          "model_id": 2,
          "metal": {
            "id": 3,
            "name": "Silver",
            "buy_price_per_gram": 30.00,
            "sale_price_per_gram": 40.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 10.49,
            "deactivated": 0,
            "created": "2024-05-22T11:30:00.000Z"
          },
          "is_main": true,
          "percentage": 85
        },
        {
          "id": 4,
          "model_id": 2,
          "metal": {
            "id": 4,
            "name": "Titanium",
            "buy_price_per_gram": 40.00,
            "sale_price_per_gram": 50.00,
            "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
            "specific_weight": 4.50,
            "deactivated": 0,
            "created": "2024-05-23T12:00:00.000Z"
          },
          "is_main": false,
          "percentage": 15
        }
      ],
      "isAvailable": true,
      "deactivated": false
    }
  ],
  "model_unavailable": [
    {
      "id": 3,
      "name": "Vintage Ring",
      "imageUrl": "http://localhost:8000/image/Metal/6/main.jpg",
      "mounting_type": {
        "id": 3,
        "name": "Tension"
      },
      "mounting_style": {
        "id": 3,
        "name": "Vintage"
      },
      "base_width": 2.5,
      "base_height": 1.8,
      "volume": 2.0,
      "model_diamond_shape": [
        {
          "model_id": 3,
          "diamond_shape": {
            "id": 5,
            "name": "Marquise",
            "drawing_path": "https://example.com/shapes/marquise.svg"
          }
        },
        {
          "model_id": 3,
          "diamond_shape": {
            "id": 6,
            "name": "Emerald",
            "drawing_path": "https://example.com/shapes/emerald.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 5,
          "model_id": 3,
          "diamond_size_min": 0.8,
          "diamond_size_max": 2.5,
          "count": 1,
          "diamond_shape": {
            "id": 5,
            "name": "Marquise",
            "drawing_path": "https://example.com/shapes/marquise.svg"
          },
          "Is_editable": true
        },
        {
          "id": 6,
          "model_id": 3,
          "diamond_size_min": 0.8,
          "diamond_size_max": 2.5,
          "count": 1,
          "diamond_shape": {
            "id": 6,
            "name": "Emerald",
            "drawing_path": "https://example.com/shapes/emerald.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 5,
          "model_id": 3,
          "metal": {
            "id": 5,
            "name": "Rose Gold",
            "buy_price_per_gram": 60.00,
            "sale_price_per_gram": 70.00,
            "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
            "specific_weight": 19.32,
            "deactivated": 0,
            "created": "2024-05-24T10:00:00.000Z"
          },
          "is_main": true,
          "percentage": 95
        },
        {
          "id": 6,
          "model_id": 3,
          "metal": {
            "id": 6,
            "name": "Palladium",
            "buy_price_per_gram": 55.00,
            "sale_price_per_gram": 65.00,
            "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
            "specific_weight": 12.02,
            "deactivated": 0,
            "created": "2024-05-25T14:00:00.000Z"
          },
          "is_main": false,
          "percentage": 5
        }
      ],
      "isAvailable": false,
      "deactivated": true
    },
    {
      "id": 4,
      "name": "Art Deco Ring",
      "imageUrl":"http://localhost:8000/image/Metal/3/main.jpg",
      "mounting_type": {
        "id": 4,
        "name": "Channel"
      },
      "mounting_style": {
        "id": 4,
        "name": "Art Deco"
      },
      "base_width": 3.5,
      "base_height": 2.2,
      "volume": 3.0,
      "model_diamond_shape": [
        {
          "model_id": 4,
          "diamond_shape": {
            "id": 7,
            "name": "Asscher",
            "drawing_path": "https://example.com/shapes/asscher.svg"
          }
        },
        {
          "model_id": 4,
          "diamond_shape": {
            "id": 8,
            "name": "Radiant",
            "drawing_path": "https://example.com/shapes/radiant.svg"
          }
        }
      ],
      "model_diamond": [
        {
          "id": 7,
          "model_id": 4,
          "diamond_size_min": 1.0,
          "diamond_size_max": 3.0,
          "count": 1,
          "diamond_shape": {
            "id": 7,
            "name": "Asscher",
            "drawing_path": "https://example.com/shapes/asscher.svg"
          },
          "Is_editable": true
        },
        {
          "id": 8,
          "model_id": 4,
          "diamond_size_min": 1.0,
          "diamond_size_max": 3.0,
          "count": 1,
          "diamond_shape": {
            "id": 8,
            "name": "Radiant",
            "drawing_path": "https://example.com/shapes/radiant.svg"
          },
          "Is_editable": false
        }
      ],
      "model_metal": [
        {
          "id": 7,
          "model_id": 4,
          "metal": {
            "id": 7,
            "name": "White Gold",
            "buy_price_per_gram": 65.00,
            "sale_price_per_gram": 75.00,
            "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
            "specific_weight": 19.32,
            "deactivated": 0,
            "created": "2024-05-26T09:30:00.000Z"
          },
          "is_main": true,
          "percentage": 80
        },
        {
          "id": 8,
          "model_id": 4,
          "metal": {
            "id": 8,
            "name": "Rhodium",
            "buy_price_per_gram": 85.00,
            "sale_price_per_gram": 95.00,
            "imageUrl": "http://localhost:8000/image/Metal/6/main.jpg",
            "specific_weight": 12.41,
            "deactivated": 0,
            "created": "2024-05-27T08:00:00.000Z"
          },
          "is_main": false,
          "percentage": 20
        }
      ],
      "isAvailable": false,
      "deactivated": true
    }
  ]
}


const Model_Page = ({mounting_model}) => {
  const navigate= useNavigate()
  console.log('type nhè',mounting_model.name)
  // const [itemsPerPage, setItemsPerPage] = useState(4);
  // const [sort, setSort] = useState(0);

  const [key, setKey] = useState('complete');
  //const [modelList, setModelList] = useState(null);

  const handleDataChange = async () => {
    //await get_account_list();
  }

  useEffect(() => {

    handleDataChange()
  }, [])

  // const itemsPerPageFromBanner = (itemsPerPage) => {
  //   setItemsPerPage(itemsPerPage);
  // };
  // const sortFromBanner = (sort) => {
  //   setSort(sort)
  // }
  return (

    <CRow style={{height:'fit-content'}}>
      <CCol xs={12}>
        

          <Tabs
            defaultActiveKey="template"
            id="fill-tab-example"
            className="mb-3"
            activeKey={key}
            fill
            onSelect={(key) => {
              setKey(key)
              navigate('?page=1')
              resetHeaderProperties();
            }}

          >

            <Tab eventKey="complete" title="Completed">
              {
                key === 'complete' && <div
                  id="complete"
                  style={{
                    boxSizing: "border-box",
                    height: "100%",
                    width: "100%"
                  }}

                >
                  {/* <ModelBanner itemsPerPageFromBanner={itemsPerPageFromBanner}  sortFromBanner={sortFromBanner} /> */}

                  {/* <Pagination completed={true} itemsPerPage={itemsPerPage}  sort={sort}  /> */}
                  <Pagination  mounting_model={mounting_model} completed={true}  />

                </div>
              }
            </Tab>


            <Tab eventKey="incomplete" title="In-Complete">
              {
                key === 'incomplete' &&
                <div
                  id="incomplete"
                  style={{
                    boxSizing: "border-box",
                    height: "100%",
                    width: "100%"
                  }}

                >
                  {/* <ModelBanner itemsPerPageFromBanner={itemsPerPageFromBanner} /> */}

                  {/* <Pagination completed={false} itemsPerPage={itemsPerPage} /> */}
                  <Pagination  mounting_model={mounting_model} completed={false}  />
                </div>
              }
            </Tab>



          </Tabs>
        

      </CCol>
    </CRow>
  );

}
export default Model_Page;

