import React, { useState, useEffect } from 'react';
import {
  Package,
  Home,
  Bike,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Shield,
  Clock,
  Compass,
  CheckCircle2,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface DeliveryRouteMapProps {
  order: Order;
  activeStatus: OrderStatus;
}

export const DeliveryRouteMap: React.FC<DeliveryRouteMapProps> = ({
  order,
  activeStatus,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activePin, setActivePin] = useState<'store' | 'courier' | 'dest' | null>('courier');
  const [showTraffic, setShowTraffic] = useState(true);
  const [courierProgress, setCourierProgress] = useState(0.65); // 0 (store) to 1 (dest)

  // Adjust courier position along route according to activeStatus
  useEffect(() => {
    switch (activeStatus) {
      case 'placed':
      case 'confirmed':
        setCourierProgress(0.05);
        break;
      case 'preparing':
        setCourierProgress(0.2);
        break;
      case 'out_for_delivery':
        setCourierProgress(0.65);
        break;
      case 'delivered':
        setCourierProgress(0.98);
        break;
      default:
        setCourierProgress(0.65);
    }
  }, [activeStatus]);

  // Route calculation coordinates in SVG viewBox 0 0 800 400
  const storeX = 100;
  const storeY = 300;
  const destX = 700;
  const destY = 100;

  // Bezier curve control points
  const cp1X = 260;
  const cp1Y = 120;
  const cp2X = 520;
  const cp2Y = 320;

  // Approximate point along cubic bezier for courier pin
  const t = courierProgress;
  const courierX =
    Math.pow(1 - t, 3) * storeX +
    3 * Math.pow(1 - t, 2) * t * cp1X +
    3 * (1 - t) * Math.pow(t, 2) * cp2X +
    Math.pow(t, 3) * destX;
  const courierY =
    Math.pow(1 - t, 3) * storeY +
    3 * Math.pow(1 - t, 2) * t * cp1Y +
    3 * (1 - t) * Math.pow(t, 2) * cp2Y +
    Math.pow(t, 3) * destY;

  return (
    <div className="relative w-full h-80 sm:h-96 bg-[#0E1116] rounded-2xl overflow-hidden border border-[#21262D] select-none">
      {/* Interactive Map Controls Top-Right */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-[#161B22]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#21262D] shadow-lg">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`p-1.5 rounded-lg transition-colors ${
            showTraffic ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle Live Traffic Overlay"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Live Route HUD Info Top-Left */}
      <div className="absolute top-3 left-3 z-20 bg-[#161B22]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#21262D] shadow-lg flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5" />
          <span className="font-bold text-white uppercase tracking-wider text-[10px]">
            Live GPS Route
          </span>
        </div>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400 font-semibold text-[11px]">
          {activeStatus === 'delivered'
            ? 'Delivered'
            : activeStatus === 'out_for_delivery'
            ? 'ETA ~6-8 mins (1.8 miles)'
            : 'Dispatching from Hub'}
        </span>
      </div>

      {/* Scaled SVG Map Canvas */}
      <div
        className="w-full h-full transition-transform duration-300 flex items-center justify-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Map Grid Background */}
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#1F2530"
                strokeWidth="1"
              />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#34D399" stopOpacity="1" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines & city blocks */}
          <rect width="800" height="400" fill="#0E1116" />
          <rect width="800" height="400" fill="url(#gridPattern)" />

          {/* Simulated city roads / streets */}
          <path
            d="M 0 150 L 800 150 M 0 280 L 800 280 M 200 0 L 200 400 M 450 0 L 450 400 M 650 0 L 650 400"
            stroke="#1B222D"
            strokeWidth="12"
            fill="none"
          />

          {/* Secondary streets */}
          <path
            d="M 0 80 L 800 80 M 0 350 L 800 350 M 100 0 L 100 400 M 350 0 L 350 400 M 550 0 L 550 400"
            stroke="#141922"
            strokeWidth="6"
            fill="none"
          />

          {/* Live Traffic Glow (Green fast corridors) */}
          {showTraffic && (
            <path
              d="M 0 150 L 800 150 M 450 0 L 450 400"
              stroke="#064e3b"
              strokeWidth="4"
              strokeOpacity="0.6"
              fill="none"
            />
          )}

          {/* Active Delivery Route Line */}
          <path
            d={`M ${storeX} ${storeY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${destX} ${destY}`}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="10 6"
            filter="url(#glow)"
            className="animate-pulse"
          />

          {/* Traveled portion (solid line behind courier) */}
          <path
            d={`M ${storeX} ${storeY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${destX} ${destY}`}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeDasharray={`${courierProgress * 800} 1000`}
          />

          {/* Store Pin Marker */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => setActivePin(activePin === 'store' ? null : 'store')}
          >
            <circle cx={storeX} cy={storeY} r="18" fill="#161B22" stroke="#10B981" strokeWidth="2" />
            <circle cx={storeX} cy={storeY} r="6" fill="#10B981" />
            <text
              x={storeX}
              y={storeY + 28}
              fill="#94A3B8"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              24/7 Mart Hub #4
            </text>
          </g>

          {/* Customer Destination Pin Marker */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => setActivePin(activePin === 'dest' ? null : 'dest')}
          >
            <circle cx={destX} cy={destY} r="18" fill="#161B22" stroke="#F43F5E" strokeWidth="2" />
            <circle cx={destX} cy={destY} r="6" fill="#F43F5E" />
            <text
              x={destX}
              y={destY + 28}
              fill="#94A3B8"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              Delivery Destination
            </text>
          </g>

          {/* Courier Pin Marker */}
          <g
            className="cursor-pointer"
            onClick={() => setActivePin(activePin === 'courier' ? null : 'courier')}
          >
            {/* Pulsing radar ring */}
            <circle
              cx={courierX}
              cy={courierY}
              r="24"
              fill="#10B981"
              fillOpacity="0.2"
              className="animate-ping"
            />
            <circle cx={courierX} cy={courierY} r="16" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            {/* Direction pointer */}
            <polygon
              points={`${courierX},${courierY - 8} ${courierX + 5},${courierY + 5} ${courierX},${courierY + 2} ${courierX - 5},${courierY + 5}`}
              fill="#FFFFFF"
            />
            <text
              x={courierX}
              y={courierY + 26}
              fill="#34D399"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              Carlos (Courier)
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Detail Overlay Modal / Popover */}
      {activePin && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 z-30 bg-[#161B22]/95 backdrop-blur-md rounded-2xl p-4 border border-[#21262D] text-white shadow-2xl animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#21262D]">
            <div className="flex items-center gap-2">
              {activePin === 'courier' && <Bike className="w-4 h-4 text-emerald-400" />}
              {activePin === 'store' && <Package className="w-4 h-4 text-emerald-400" />}
              {activePin === 'dest' && <Home className="w-4 h-4 text-rose-400" />}
              <h5 className="font-bold text-xs">
                {activePin === 'courier'
                  ? 'Courier on the Move'
                  : activePin === 'store'
                  ? '24/7 Mart Fulfillment Hub #4'
                  : 'Customer Delivery Address'}
              </h5>
            </div>
            <button
              onClick={() => setActivePin(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>

          <div className="pt-2 text-xs space-y-1.5 text-slate-300">
            {activePin === 'courier' && (
              <>
                <p className="text-slate-400">
                  Driver: <span className="font-bold text-white">Carlos M.</span> (4.9 ★ • 1,420 Deliveries)
                </p>
                <p className="text-slate-400">
                  Vehicle: <span className="font-semibold text-emerald-400">Zero-Emission E-Bike #24</span>
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-[#21262D]">
                  <span>Speed: 18 mph</span>
                  <span>Battery: 92%</span>
                </div>
              </>
            )}

            {activePin === 'store' && (
              <>
                <p className="text-slate-400">
                  Address: <span className="text-white">400 Commerce Way, Metro Hub</span>
                </p>
                <p className="text-slate-400">
                  Status: <span className="text-emerald-400 font-semibold">Order Packed & Quality Checked</span>
                </p>
              </>
            )}

            {activePin === 'dest' && (
              <>
                <p className="text-slate-400">
                  Address: <span className="text-white font-medium">{order.deliveryAddress.streetAddress}, {order.deliveryAddress.city}</span>
                </p>
                {order.deliveryAddress.deliveryInstructions && (
                  <p className="text-[11px] bg-slate-800/80 p-2 rounded-lg text-emerald-300 mt-1">
                    Note: "{order.deliveryAddress.deliveryInstructions}"
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
