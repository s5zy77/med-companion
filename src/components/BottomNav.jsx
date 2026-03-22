import React from 'react';
import Icon from './Icon';
import { NAV_ITEMS } from '../utils/constants';

export default function BottomNav({ page, setPage }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`bottom-nav-item ${page === item.id ? 'active' : ''}`}
          onClick={() => setPage(item.id)}
          aria-label={item.label}
          aria-current={page === item.id ? 'page' : undefined}
        >
          <Icon name={item.icon} size={22} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
