import React from 'react';
import { motion } from 'framer-motion';

/**
 * Fake3DPillVisual
 * A pure CSS + Framer Motion "3D" pill/capsule that displays the
 * spatial metadata returned by the FastAPI /analyze-prescription endpoint.
 *
 * Props:
 *  - metadata: the SpatialMetadata JSON object from the backend
 */
export default function Fake3DPillVisual({ metadata }) {
  const { chroma_specs, ocr_artifacts, spatial_scale } = metadata;
  const color = chroma_specs.hex_code;       // e.g. "#34d399"
  const glow  = chroma_specs.glow_intensity; // 0-1

  // Derive pill dimensions from spatial_scale  [x, y, z]
  const widthVw  = Math.max(120, spatial_scale[0] * 56); // px
  const heightVw = Math.max(56,  spatial_scale[1] * 70);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 3-D pill stage */}
      <div className="relative flex items-center justify-center w-full py-10">

        {/* Ambient glow halo */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ background: color, filter: 'blur(40px)', opacity: glow * 0.6 }}
          className="absolute rounded-full"
          css={{ width: widthVw * 1.4, height: heightVw * 1.6 }}
        />

        {/* Pill body — subtle 3-D achieved via box-shadow and two-tone split */}
        <motion.div
          animate={{ rotateY: [0, 18, 0, -18, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          style={{
            width:  widthVw,
            height: heightVw,
            borderRadius: heightVw,
            background: `
              linear-gradient(
                135deg,
                ${color}ff 0%,
                ${color}cc 40%,
                ${color}88 70%,
                ${color}44 100%
              )
            `,
            boxShadow: `
              inset 0 6px 16px rgba(255,255,255,0.35),
              inset 0 -6px 16px rgba(0,0,0,0.25),
              0 0 ${Math.round(glow * 60)}px ${color}99,
              0 20px 40px rgba(0,0,0,0.5)
            `,
            transformStyle: 'preserve-3d',
          }}
          className="relative"
        >
          {/* Highlight streak */}
          <div
            style={{
              position: 'absolute',
              top: '14%', left: '18%',
              width: '28%', height: '22%',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.45)',
              filter: 'blur(6px)',
              transform: 'rotate(-30deg)',
            }}
          />

          {/* Imprint text */}
          <div
            style={{ color: `rgba(255,255,255,0.65)`, letterSpacing: '0.1em' }}
            className="absolute inset-0 flex items-center justify-center text-sm font-bold"
          >
            {ocr_artifacts.imprint_text}
          </div>
        </motion.div>

        {/* Orbit ring */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: widthVw * 1.5,
            height: heightVw * 0.28,
            border: `1.5px solid ${color}55`,
            borderRadius: '50%',
            boxShadow: `0 0 12px ${color}33`,
          }}
        />
      </div>

      {/* Spatial Diagnostics info strip */}
      <div className="w-full grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Scale X', value: `${spatial_scale[0]}` },
          { label: 'Scale Y', value: `${spatial_scale[1]}` },
          { label: 'Scale Z', value: `${spatial_scale[2]}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-800 rounded-lg py-2 px-3">
            <p className="text-slate-500 text-xs mb-0.5">{label}</p>
            <p className="text-emerald-400 font-mono font-semibold text-sm">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
