import React from 'react'
import List from '../components/VirtualList/List'

const mockData = Array.from({ length: 250 }, (_, index) => ({
  // Native browser API for generating standard v4 UUIDs
  id: crypto.randomUUID(), 
  title: `Virtual Row ${index}`,
  isActive: Math.random() > 0.5 // 50% chance of being true
}));

function VirtualList() {
  return (
    <div><List data={mockData}/></div>
  )
}

export default VirtualList