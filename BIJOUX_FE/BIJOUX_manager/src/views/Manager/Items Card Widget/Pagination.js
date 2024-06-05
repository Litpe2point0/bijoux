import { get } from 'jquery';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { get_account_list } from '../../../api/accounts/Account_Api';
import { CCol, CRow, CSpinner } from '@coreui/react';
import ModelCard from './ModelCard';
import { useLocation, useNavigate,  } from 'react-router-dom';


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
      "deactivated": 0
    },
    {
      "id": 4,
      "name": "Art Deco Ring",
      "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
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
      "deactivated": 0
    }
  ]
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Models({ currentModels }) {
  console.log("currentModels", currentModels)

  return (

    <CRow className='w-100 d-flex justify-content-center'>


      {currentModels && currentModels.map((item) => (
        <CCol className='m-2' sm={6} md={4} lg={4} xl={3} xxl={2}>

          <ModelCard {...item} />
        </CCol>

      ))}


    </CRow>

  );
}



export default function Pagination({ itemsPerPage, completed }) {
  const navigate = useNavigate();
    const query = useQuery();


  const [modelList, setModelList] = useState(null);

  const [loading, setLoading] = useState(true);

  const [currentModels, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);


  useEffect(() => {
    const page = parseInt(query.get('page')) || 1;
    const newOffset = (page - 1) * itemsPerPage;
    setItemOffset(newOffset);
  }, [query, itemsPerPage]);

  useEffect(() => {
    const setAttribute = async () => {

      await get_account_list();
      await get_account_list();
      await get_account_list();
      await get_account_list();
      await get_account_list();
      await get_account_list();
      //alert('ngu1')

      if (completed) {
        await get_account_list(data);

        setModelList(data.model_available)
      } else {
        await get_account_list(data);
        setModelList(data.model_unavailable)
      }

      setLoading(false);
    }
    setAttribute()

  }, []);

  useEffect(() => {

    const re_render = async () => {
      setLoading(true)


      await get_account_list();
      await get_account_list();
      await get_account_list();
      await get_account_list();
      await get_account_list();
      await get_account_list();
      await get_account_list();
      //alert('ngu2')

      const list = completed ? data.model_available : data.model_unavailable;
      console.log("list", list)
      setModelList(list)

      const endOffset = itemOffset + itemsPerPage;


      setCurrentItems(list.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(list.length / itemsPerPage));
      setLoading(false);
    }
    re_render()
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage % modelList.length;
    setItemOffset(newOffset);
    navigate(`?page=${event.selected + 1}`);
  };

  return (
    <div className='d-flex flex-column align-items-center h-100'>
      {loading
        ?
        <div className="d-flex justify-content-center align-items-center h-100" style={{ minHeight: '50vh' }}><CSpinner color="primary" /></div>
        :
        <Models currentModels={currentModels} />
      }

      <ReactPaginate
        previousLabel="< previous"
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination  mt-5"
        containerStyle={{ marginTop: '400px' }}
        activeClassName="active"
        renderOnZeroPageCount={null}
        forcePage={parseInt(query.get('page')) - 1 || 0}
      />
    </div>
  );
}