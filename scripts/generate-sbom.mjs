/**
 * Software Bill of Materials (SBOM) Generator
 * Phase 18: Supply-Chain Security & Compliance (REQ-INFRA-017)
 *
 * Generates CycloneDX-compatible JSON inventory of production dependencies,
 * licenses, versions, and integrity hashes.
 */

import fs from 'node:fs';
import path from 'node:path';

export function generateSbom(outputPath = './sbom.json') {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  const lockPath = path.resolve(process.cwd(), 'package-lock.json');

  if (!fs.existsSync(pkgPath) || !fs.existsSync(lockPath)) {
    throw new Error('package.json or package-lock.json not found');
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));

  const components = [];
  const prodDependencies = pkg.dependencies || {};

  for (const [depName, versionReq] of Object.entries(prodDependencies)) {
    // Lookup resolved package in lockfile
    const lockEntry = lock.packages?.[`node_modules/${depName}`] || {};
    components.push({
      type: 'library',
      name: depName,
      version: lockEntry.version || versionReq.replace(/^[\^~]/, ''),
      purl: `pkg:npm/${depName}@${lockEntry.version || versionReq}`,
      integrity: lockEntry.integrity || 'UNKNOWN',
      license: lockEntry.license || 'UNKNOWN',
      scope: 'required',
    });
  }

  const sbom = {
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    serialNumber: `urn:uuid:interviewprep-sbom-${Date.now()}`,
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [{ vendor: 'InterviewPrep DevOps', name: 'sbom-generator', version: '1.0.0' }],
      component: {
        type: 'application',
        name: pkg.name || 'frontend-interview-platform',
        version: pkg.version || '1.0.0',
        description: 'Enterprise Real-Time Collaboration & Interview Platform',
      },
    },
    components,
  };

  fs.writeFileSync(path.resolve(process.cwd(), outputPath), JSON.stringify(sbom, null, 2), 'utf8');
  console.log(`[SBOM Generator] Successfully generated ${components.length} components to ${outputPath}`);
  return sbom;
}

if (process.argv[1]?.endsWith('generate-sbom.mjs')) {
  try {
    generateSbom();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
