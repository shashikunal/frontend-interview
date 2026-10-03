const fs = require('fs');
const path = require('path');

// Curriculum metadata and topic blueprints
const categories = [
  { id: "dom-basics", name: "DOM Basics & Architecture", count: 35 },
  { id: "element-selection", name: "Element Selection & Collections", count: 45 },
  { id: "dom-traversal", name: "DOM Traversal & Navigation", count: 35 },
  { id: "node-creation", name: "Node Creation & Insertion", count: 45 },
  { id: "node-removal", name: "Node Removal & Replacement", count: 25 },
  { id: "content-text", name: "Content & Text Manipulation", count: 35 },
  { id: "attributes-dataset", name: "Attributes & Dataset", count: 30 },
  { id: "styles-classes", name: "Styles, Classes & CSS OM", count: 30 },
  { id: "event-system", name: "Event System & Propagation", count: 45 },
  { id: "event-types", name: "Event Types & Interactions", count: 40 },
  { id: "forms-widgets", name: "Forms & Interactive Components", count: 35 },
  { id: "dom-performance", name: "DOM Performance, Reflow & Repaint", count: 25 },
  { id: "observers", name: "Observers (Mutation, Intersection, Resize)", count: 25 },
  { id: "shadow-dom", name: "Shadow DOM & Web Components", count: 25 },
  { id: "dom-security", name: "DOM Security & XSS Prevention", count: 20 },
  { id: "practical-scenarios", name: "Practical Architecture, Scenarios & Output", count: 50 }
];

console.log('Total categories:', categories.length, 'Total planned:', categories.reduce((sum, c) => sum + c.count, 0));
