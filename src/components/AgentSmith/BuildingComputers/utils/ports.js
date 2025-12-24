// src/components/AgentSmith/BuildingComputers/utils/ports.js
import * as THREE from "three";

/**
 * byPart: {
 * motherboard?: Box3,
 * gpu?: Box3,
 * psu?: Box3
 * }
 *
 * Returns an object like:
 * {
 * atx24: Vector3,
 * psu_atx24: Vector3,
 * psu_pcie: Vector3,
 * gpu_pcie8_1: Vector3
 * }
 */
export function buildPortsFromBounds(byPart = {}) {
  const ports = {};

  if (byPart.motherboard) {
    const mb = byPart.motherboard;
    const center = mb.getCenter(new THREE.Vector3());
    const size = mb.getSize(new THREE.Vector3());

    // Main 24-pin ATX – right edge of the board
    ports.atx24 = new THREE.Vector3(
      mb.max.x + size.x * 0.02,
      center.y + size.y * 0.05,
      center.z
    );
  }

  if (byPart.psu) {
    const psu = byPart.psu;
    const center = psu.getCenter(new THREE.Vector3());
    const size = psu.getSize(new THREE.Vector3());

    // Assume PSU connectors facing inside the case (towards +Z)
    ports.psu_atx24 = new THREE.Vector3(
      center.x,
      center.y + size.y * 0.1,
      psu.max.z + size.z * 0.02
    );

    // PCIe power connectors (same region, slightly shifted)
    ports.psu_pcie = new THREE.Vector3(
      center.x - size.x * 0.15,
      center.y + size.y * 0.05,
      psu.max.z + size.z * 0.02
    );
  }

  if (byPart.gpu) {
    const gpu = byPart.gpu;
    const center = gpu.getCenter(new THREE.Vector3());
    const size = gpu.getSize(new THREE.Vector3());

    // GPU 8-pin on top edge, near one side
    ports.gpu_pcie8_1 = new THREE.Vector3(
      gpu.max.x - size.x * 0.2,
      gpu.max.y + size.y * 0.02,
      center.z
    );
  }

  return ports;
}