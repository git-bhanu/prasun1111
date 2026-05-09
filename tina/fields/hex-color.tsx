import React from 'react';
import { wrapFieldsWithMeta } from 'tinacms';

export const HexColorInput = wrapFieldsWithMeta(({ input }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        id={input.name}
        value={input.value || '#000000'}
        onChange={(e) => input.onChange(e.target.value)}
        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
      />
      <input
        type="text"
        value={input.value || ''}
        onChange={(e) => input.onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm font-mono"
      />
    </div>
  );
});
