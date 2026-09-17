/**
 * Collaborative Vector Whiteboard Component
 * Phase 6: In-Meeting Collaborative Vector Whiteboard
 */

import React, { useState, useRef, useCallback } from 'react';
import type {
  WhiteboardElement,
  WhiteboardElementType,
  Point,
} from '../../../../server/meetings/whiteboardTypes.ts';

interface MeetingWhiteboardProps {
  meetingId: string;
  currentUserId: string;
  currentUserName: string;
  elements: WhiteboardElement[];
  onUpsertElement: (elem: Partial<WhiteboardElement> & { id: string; type: WhiteboardElementType }) => Promise<void>;
  onDeleteElement: (elementId: string) => Promise<void>;
  onClearBoard: () => Promise<void>;
  onClose: () => void;
}

type ToolType = WhiteboardElementType | 'SELECT' | 'ERASER';

const COLOR_PALETTE = ['#4318ff', '#01b574', '#ee5d50', '#ffb547', '#00d2d3', '#ffffff'];

export const MeetingWhiteboard: React.FC<MeetingWhiteboardProps> = ({
  currentUserName,
  elements,
  onUpsertElement,
  onDeleteElement,
  onClearBoard,
  onClose,
}) => {
  const [activeTool, setActiveTool] = useState<ToolType>('DRAW');
  const [selectedColor, setSelectedColor] = useState<string>('#4318ff');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Drawing in progress
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<Point>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Point>({ x: 0, y: 0 });
  const [drawPoints, setDrawPoints] = useState<Point[]>([]);

  // Dragging existing element in SELECT mode
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  const getSvgCoordinates = useCallback((e: React.MouseEvent): Point => {
    if (!svgRef.current) return { x: e.clientX, y: e.clientY };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  }, []);

  // 1. Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    const pt = getSvgCoordinates(e);

    if (activeTool === 'SELECT') {
      if (selectedElementId) {
        const elem = elements.find(el => el.id === selectedElementId);
        if (elem) {
          setIsDragging(true);
          setDragOffset({ x: pt.x - elem.x, y: pt.y - elem.y });
        }
      }
      return;
    }

    setIsDrawing(true);
    setStartPos(pt);
    setCurrentPos(pt);

    if (activeTool === 'DRAW') {
      setDrawPoints([pt]);
    }
  };

  // 2. Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    const pt = getSvgCoordinates(e);

    if (isDragging && selectedElementId) {
      const elem = elements.find(el => el.id === selectedElementId);
      if (elem) {
        elem.x = pt.x - dragOffset.x;
        elem.y = pt.y - dragOffset.y;
      }
      return;
    }

    if (!isDrawing) return;
    setCurrentPos(pt);

    if (activeTool === 'DRAW') {
      setDrawPoints(prev => [...prev, pt]);
    }
  };

  // 3. Mouse Up
  const handleMouseUp = async () => {
    if (isDragging && selectedElementId) {
      setIsDragging(false);
      const elem = elements.find(el => el.id === selectedElementId);
      if (elem) {
        await onUpsertElement({
          id: elem.id,
          type: elem.type,
          x: elem.x,
          y: elem.y,
        });
      }
      return;
    }

    if (!isDrawing) return;
    setIsDrawing(false);

    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.max(20, Math.abs(currentPos.x - startPos.x));
    const height = Math.max(20, Math.abs(currentPos.y - startPos.y));
    const id = `el_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    if (activeTool === 'DRAW') {
      if (drawPoints.length > 1) {
        await onUpsertElement({
          id,
          type: 'DRAW',
          x: startPos.x,
          y: startPos.y,
          width,
          height,
          points: drawPoints,
          strokeColor: selectedColor,
          strokeWidth,
        });
      }
      setDrawPoints([]);
      return;
    }

    if (activeTool === 'TEXT') {
      const userText = window.prompt('Enter text for annotation:', 'System Architecture');
      if (userText && userText.trim()) {
        await onUpsertElement({
          id,
          type: 'TEXT',
          x: startPos.x,
          y: startPos.y,
          width: 160,
          height: 36,
          text: userText.trim(),
          strokeColor: selectedColor,
          strokeWidth,
        });
      }
      return;
    }

    if (['RECTANGLE', 'CIRCLE', 'DIAMOND', 'ARROW', 'LINE'].includes(activeTool)) {
      await onUpsertElement({
        id,
        type: activeTool as WhiteboardElementType,
        x,
        y,
        width,
        height,
        strokeColor: selectedColor,
        strokeWidth,
      });
    }
  };

  // Element Click Handler
  const handleElementClick = async (e: React.MouseEvent, elem: WhiteboardElement) => {
    e.stopPropagation();

    if (activeTool === 'ERASER') {
      await onDeleteElement(elem.id);
      return;
    }

    if (activeTool === 'SELECT') {
      setSelectedElementId(elem.id);
    }
  };

  // Convert points array to SVG path string
  const pointsToSvgPath = (points?: Point[]): string => {
    if (!points || points.length === 0) return '';
    const [first, ...rest] = points;
    return `M ${first.x} ${first.y} ` + rest.map(p => `L ${p.x} ${p.y}`).join(' ');
  };

  // Render SVG Element
  const renderElement = (el: WhiteboardElement, isSelected: boolean) => {
    const isElemEraserHover = activeTool === 'ERASER';

    switch (el.type) {
      case 'RECTANGLE':
        return (
          <g key={el.id} onClick={e => handleElementClick(e, el)}>
            <rect
              x={el.x}
              y={el.y}
              width={el.width}
              height={el.height}
              rx={8}
              fill="rgba(17, 28, 68, 0.6)"
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              className={`rtc-wb-shape ${isSelected ? 'selected' : ''} ${isElemEraserHover ? 'eraser-hover' : ''}`}
            />
          </g>
        );

      case 'CIRCLE':
        return (
          <g key={el.id} onClick={e => handleElementClick(e, el)}>
            <ellipse
              cx={el.x + el.width / 2}
              cy={el.y + el.height / 2}
              rx={el.width / 2}
              ry={el.height / 2}
              fill="rgba(17, 28, 68, 0.6)"
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              className={`rtc-wb-shape ${isSelected ? 'selected' : ''} ${isElemEraserHover ? 'eraser-hover' : ''}`}
            />
          </g>
        );

      case 'DIAMOND': {
        const midX = el.x + el.width / 2;
        const midY = el.y + el.height / 2;
        const pts = `${midX},${el.y} ${el.x + el.width},${midY} ${midX},${el.y + el.height} ${el.x},${midY}`;
        return (
          <g key={el.id} onClick={e => handleElementClick(e, el)}>
            <polygon
              points={pts}
              fill="rgba(17, 28, 68, 0.6)"
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              className={`rtc-wb-shape ${isSelected ? 'selected' : ''} ${isElemEraserHover ? 'eraser-hover' : ''}`}
            />
          </g>
        );
      }

      case 'LINE':
        return (
          <g key={el.id} onClick={e => handleElementClick(e, el)}>
            <line
              x1={el.x}
              y1={el.y}
              x2={el.x + el.width}
              y2={el.y + el.height}
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              strokeLinecap="round"
              className={`rtc-wb-shape ${isSelected ? 'selected' : ''} ${isElemEraserHover ? 'eraser-hover' : ''}`}
            />
          </g>
        );

      case 'ARROW':
        return (
          <g key={el.id} onClick={e => handleElementClick(e, el)}>
            <line
              x1={el.x}
              y1={el.y}
              x2={el.x + el.width}
              y2={el.y + el.height}
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              className={`rtc-wb-shape ${isSelected ? 'selected' : ''} ${isElemEraserHover ? 'eraser-hover' : ''}`}
            />
          </g>
        );

      case 'TEXT':
        return (
          <g key={el.id} onClick={e => handleElementClick(e, el)}>
            <text
              x={el.x}
              y={el.y + 20}
              fill={el.strokeColor}
              fontSize={18}
              fontWeight="600"
              fontFamily="-apple-system, sans-serif"
              className={`rtc-wb-shape ${isSelected ? 'selected' : ''} ${isElemEraserHover ? 'eraser-hover' : ''}`}
            >
              {el.text}
            </text>
          </g>
        );

      case 'DRAW':
        return (
          <g key={el.id} onClick={e => handleElementClick(e, el)}>
            <path
              d={pointsToSvgPath(el.points)}
              fill="none"
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`rtc-wb-shape ${isSelected ? 'selected' : ''} ${isElemEraserHover ? 'eraser-hover' : ''}`}
            />
          </g>
        );

      default:
        return null;
    }
  };

  // Export SVG to PNG download
  const handleExport = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meeting-whiteboard-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rtc-whiteboard-arena">
      {/* Floating Canvas Action Bar */}
      <div className="rtc-wb-toolbar">
        {/* Tool Buttons */}
        <div className="rtc-wb-tool-group">
          <button
            type="button"
            className={`rtc-wb-tool-btn ${activeTool === 'SELECT' ? 'active' : ''}`}
            onClick={() => setActiveTool('SELECT')}
            title="Select / Move Shape"
          >
            👆
          </button>
          <button
            type="button"
            className={`rtc-wb-tool-btn ${activeTool === 'DRAW' ? 'active' : ''}`}
            onClick={() => setActiveTool('DRAW')}
            title="Freehand Pen Draw"
          >
            ✏️
          </button>
          <button
            type="button"
            className={`rtc-wb-tool-btn ${activeTool === 'RECTANGLE' ? 'active' : ''}`}
            onClick={() => setActiveTool('RECTANGLE')}
            title="Rectangle (Architecture Block)"
          >
            ⬜
          </button>
          <button
            type="button"
            className={`rtc-wb-tool-btn ${activeTool === 'CIRCLE' ? 'active' : ''}`}
            onClick={() => setActiveTool('CIRCLE')}
            title="Circle / Ellipse"
          >
            ⭕
          </button>
          <button
            type="button"
            className={`rtc-wb-tool-btn ${activeTool === 'DIAMOND' ? 'active' : ''}`}
            onClick={() => setActiveTool('DIAMOND')}
            title="Decision Diamond"
          >
            🔶
          </button>
          <button
            type="button"
            className={`rtc-wb-tool-btn ${activeTool === 'ARROW' ? 'active' : ''}`}
            onClick={() => setActiveTool('ARROW')}
            title="Connecting Arrow"
          >
            ↗️
          </button>
          <button
            type="button"
            className={`rtc-wb-tool-btn ${activeTool === 'LINE' ? 'active' : ''}`}
            onClick={() => setActiveTool('LINE')}
            title="Connector Line"
          >
            ➖
          </button>
          <button
            type="button"
            className={`rtc-wb-tool-btn ${activeTool === 'TEXT' ? 'active' : ''}`}
            onClick={() => setActiveTool('TEXT')}
            title="Text Note Annotation"
          >
            🔤
          </button>
          <button
            type="button"
            className={`rtc-wb-tool-btn ${activeTool === 'ERASER' ? 'active' : ''}`}
            onClick={() => setActiveTool('ERASER')}
            title="Eraser (Click shape to delete)"
          >
            🧹
          </button>
        </div>

        <div className="rtc-wb-separator" />

        {/* Color Palette */}
        <div className="rtc-wb-color-group">
          {COLOR_PALETTE.map(color => (
            <button
              key={color}
              type="button"
              className={`rtc-wb-color-dot ${selectedColor === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>

        <div className="rtc-wb-separator" />

        {/* Stroke Width Selector */}
        <div className="rtc-wb-stroke-group">
          {[2, 4, 6].map(width => (
            <button
              key={width}
              type="button"
              className={`rtc-wb-stroke-btn ${strokeWidth === width ? 'active' : ''}`}
              onClick={() => setStrokeWidth(width)}
              title={`Stroke width: ${width}px`}
            >
              <div
                className="rtc-wb-stroke-preview"
                style={{ height: `${width}px`, backgroundColor: selectedColor }}
              />
            </button>
          ))}
        </div>

        <div className="rtc-wb-separator" />

        {/* Utility Actions */}
        <div className="rtc-wb-action-group">
          <button
            type="button"
            className="rtc-wb-btn"
            onClick={handleExport}
            title="Export whiteboard as SVG diagram"
          >
            💾 Export
          </button>
          <button
            type="button"
            className="rtc-wb-btn rtc-wb-btn-danger"
            onClick={() => {
              if (window.confirm('Clear all drawings from collaborative whiteboard?')) {
                onClearBoard();
              }
            }}
            title="Clear canvas"
          >
            🗑️ Clear
          </button>
          <button
            type="button"
            className="rtc-wb-btn rtc-wb-btn-close"
            onClick={onClose}
            title="Exit whiteboard view"
          >
            ✕ Exit
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <svg
        ref={svgRef}
        className="rtc-whiteboard-svg-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          if (activeTool === 'SELECT') setSelectedElementId(null);
        }}
      >
        {/* SVG Marker Definitions */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={selectedColor} />
          </marker>
        </defs>

        {/* Grid Background Pattern */}
        <pattern id="wb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#wb-grid)" />

        {/* Committed Elements */}
        {elements.map(el => renderElement(el, el.id === selectedElementId))}

        {/* In-Progress Freehand Pen Drawing */}
        {isDrawing && activeTool === 'DRAW' && drawPoints.length > 1 && (
          <path
            d={pointsToSvgPath(drawPoints)}
            fill="none"
            stroke={selectedColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* In-Progress Shape Preview */}
        {isDrawing && activeTool === 'RECTANGLE' && (
          <rect
            x={Math.min(startPos.x, currentPos.x)}
            y={Math.min(startPos.y, currentPos.y)}
            width={Math.abs(currentPos.x - startPos.x)}
            height={Math.abs(currentPos.y - startPos.y)}
            rx={8}
            fill="rgba(67, 24, 255, 0.1)"
            stroke={selectedColor}
            strokeWidth={strokeWidth}
            strokeDasharray="4 4"
          />
        )}

        {isDrawing && activeTool === 'CIRCLE' && (
          <ellipse
            cx={(startPos.x + currentPos.x) / 2}
            cy={(startPos.y + currentPos.y) / 2}
            rx={Math.abs(currentPos.x - startPos.x) / 2}
            ry={Math.abs(currentPos.y - startPos.y) / 2}
            fill="rgba(67, 24, 255, 0.1)"
            stroke={selectedColor}
            strokeWidth={strokeWidth}
            strokeDasharray="4 4"
          />
        )}

        {isDrawing && activeTool === 'ARROW' && (
          <line
            x1={startPos.x}
            y1={startPos.y}
            x2={currentPos.x}
            y2={currentPos.y}
            stroke={selectedColor}
            strokeWidth={strokeWidth}
            strokeDasharray="4 4"
            markerEnd="url(#arrowhead)"
          />
        )}

        {isDrawing && activeTool === 'LINE' && (
          <line
            x1={startPos.x}
            y1={startPos.y}
            x2={currentPos.x}
            y2={currentPos.y}
            stroke={selectedColor}
            strokeWidth={strokeWidth}
            strokeDasharray="4 4"
          />
        )}
      </svg>

      {/* Collaborator Badge Indicator */}
      <div className="rtc-wb-collaborator-pill">
        <span className="rtc-quality-dot" />
        <span>Live Whiteboard · Drawing as <strong>{currentUserName}</strong></span>
      </div>
    </div>
  );
};
