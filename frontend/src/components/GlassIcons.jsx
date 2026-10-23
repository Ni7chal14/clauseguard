import React from 'react';

const gradientMapping = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

const GlassIcons = ({ items = [], className = '' }) => {
  const getBackgroundStyle = color => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  const isVertical = className.includes('vertical');

  if (isVertical) {
    return (
      <div className={`flex flex-col gap-[1.4em] items-start w-full py-[0.5em] overflow-visible ${className}`}>
        {items.map((item, index) => (
          <div
            key={index}
            onClick={item.onClick}
            className="flex items-center gap-[1.2em] cursor-pointer group w-full px-2"
          >
            {/* 3D Glass Icon Button wrapper */}
            <div
              className="relative w-[4.5em] h-[4.5em] text-[inherit] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] shrink-0"
            >
              {/* Backing color plate */}
              <span
                className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] [will-change:transform] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
                style={getBackgroundStyle(item.color)}
              />

              {/* Frosted glass top overlay */}
              <span className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block border border-white/20 bg-white/10 backdrop-blur-[0.75em] transition-transform duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] [will-change:transform] [transform-style:preserve-3d] [transform:translate3d(0,0,1px)] group-hover:[transform:translate3d(0,0,2em)] flex items-center justify-center text-white text-[1.5em] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                {item.icon}
              </span>
            </div>

            {/* Label always visible on the right */}
            <span className="text-[1.8em] font-semibold text-on-surface-variant/80 group-hover:text-on-surface transition-colors duration-200 select-none">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Original horizontal grid mode
  return (
    <div
      className={`grid gap-[4.5em] justify-items-center py-[1em] overflow-visible grid-cols-2 md:grid-cols-3 ${className}`}
    >
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          aria-label={item.label}
          onClick={item.onClick}
          className={`relative bg-transparent outline-none border-none cursor-pointer w-[4.5em] h-[4.5em] text-[inherit] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group ${
            item.customClass || ''
          }`}
        >
          {/* Backing color plate */}
          <span
            className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] [will-change:transform] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
            style={getBackgroundStyle(item.color)}
          />

          {/* Frosted glass top overlay */}
          <span className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block border border-white/20 bg-white/10 backdrop-blur-[0.75em] transition-transform duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] [will-change:transform] [transform-style:preserve-3d] [transform:translate3d(0,0,1px)] group-hover:[transform:translate3d(0,0,2em)] flex items-center justify-center text-white text-[1.5em] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
            {item.icon}
          </span>

          {/* Label */}
          <span className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-xs font-semibold text-on-surface-variant/90 opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(15%)]">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;
