"""
SAR (Synthetic Aperture Radar) Preprocessing and Speckle Filtering Service.
Handles Sentinel-1 C-band IW GRD calibration, Refined Lee speckle filtering,
terrain slope correction, and bitemporal backscatter difference calculation.
"""
from typing import Tuple, Optional
import numpy as np

class SARPreprocessor:
    def __init__(self, kernel_size: int = 5, damping_factor: float = 1.0):
        """
        Initialize SAR preprocessor.
        :param kernel_size: Odd integer for sliding window size (e.g. 5x5).
        :param damping_factor: Filter dampening parameter.
        """
        self.kernel_size = kernel_size
        self.damping_factor = damping_factor

    @staticmethod
    def linear_to_db(linear_val: np.ndarray, eps: float = 1e-7) -> np.ndarray:
        """
        Converts linear power backscatter to decibel scale:
        sigma_0_dB = 10 * log10(sigma_0_linear)
        """
        safe_val = np.maximum(linear_val, eps)
        return 10.0 * np.log10(safe_val)

    @staticmethod
    def db_to_linear(db_val: np.ndarray) -> np.ndarray:
        """
        Converts decibel backscatter to linear scale.
        """
        return 10.0 ** (db_val / 10.0)

    def apply_lee_filter(self, img: np.ndarray, num_looks: int = 4) -> np.ndarray:
        """
        Implements the classic Refined Lee Speckle Filter for SAR intensity imagery.
        Formula:
            y_hat = local_mean + W * (pixel - local_mean)
            W = max(0, (local_var - noise_var) / local_var)
            noise_var = (local_mean^2) / num_looks
        Preserves edges (river levees, bridges, embankments) while smoothing water speckle.
        """
        k = self.kernel_size
        pad_size = k // 2
        padded = np.pad(img, pad_size, mode='reflect')
        
        filtered = np.zeros_like(img, dtype=np.float32)
        h, w = img.shape

        # Compute using vectorized 2D sliding windows or fast uniform filters
        for r in range(h):
            for c in range(w):
                window = padded[r:r + k, c:c + k]
                mean = np.mean(window)
                var = np.var(window)
                
                # Speckle noise variance in multi-look SAR intensity image
                noise_var = (mean ** 2) / float(num_looks)
                
                if var <= 0 or noise_var >= var:
                    weight = 0.0
                else:
                    weight = (var - noise_var) / (var + 1e-6)
                
                weight = np.clip(weight * self.damping_factor, 0.0, 1.0)
                filtered[r, c] = mean + weight * (img[r, c] - mean)

        return filtered

    def compute_bitemporal_difference(
        self, 
        pre_flood_sar_db: np.ndarray, 
        post_flood_sar_db: np.ndarray
    ) -> np.ndarray:
        """
        Calculates bitemporal backscatter anomaly:
        Delta_sigma_0 = post_flood_sigma_0_dB - pre_flood_sigma_0_dB
        Negative values (< -3 dB) typically indicate open surface flood water due to specular reflection.
        """
        return post_flood_sar_db - pre_flood_sar_db

    def apply_terrain_mask(
        self, 
        inundation_mask: np.ndarray, 
        dem_slope: np.ndarray, 
        max_slope_deg: float = 12.0
    ) -> np.ndarray:
        """
        Eliminates radar shadow false positives over high terrain slopes (Himalayan foothills/Garo Hills).
        Water cannot form large stagnant flood lakes on steep terrain (> 12 degrees).
        """
        filtered_mask = np.copy(inundation_mask)
        filtered_mask[dem_slope > max_slope_deg] = 0
        return filtered_mask

    def detect_inundation_threshold(
        self,
        pre_sar_db: np.ndarray,
        post_sar_db: np.ndarray,
        permanent_water_mask: Optional[np.ndarray] = None,
        dem_slope: Optional[np.ndarray] = None,
        threshold_db: float = -3.0,
        absolute_water_threshold_db: float = -15.0
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Performs dual-criterion flood detection:
        1. Backscatter drop: Delta_sigma_0 < threshold_db (typically -3.0 dB)
        2. Absolute dark water condition: post_flood_sigma_0 <= -15.0 dB
        3. Exclude permanent water bodies (e.g. Brahmaputra dry-season channel)
        4. Exclude steep mountain terrain slopes
        """
        diff_db = self.compute_bitemporal_difference(pre_sar_db, post_sar_db)
        
        # Primary inundation condition
        is_flooded = (diff_db < threshold_db) & (post_sar_db < absolute_water_threshold_db)
        inundation_binary = is_flooded.astype(np.uint8)

        # Mask permanent water (so we only report newly inundated flood zones)
        if permanent_water_mask is not None:
            inundation_binary[permanent_water_mask == 1] = 0

        # Mask steep slopes
        if dem_slope is not None:
            inundation_binary = self.apply_terrain_mask(inundation_binary, dem_slope)

        return inundation_binary, diff_db
