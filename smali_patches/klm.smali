.class public final Lklm;
.super Ljava/lang/Object;
.source "PG"


# direct methods
.method public constructor <init>()V
    .registers 1

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

# =========================================================================
# Item 4: Pure-TFLite Monocular Depth for IMX355 Front Sensor
# =========================================================================

# Stereo disparity check: forced to return false (0x0).
# Because Pixel 6a's front IMX355 sensor lacks dual-pixel PDAF hardware for hardware disparity,
# returning false avoids EdgeTPU disparity crashes on the single front camera.
.method public final checkStereoDisparity()Z
    .registers 2

    const/4 v0, 0x0

    return v0
.end method

.method public static isStereoDisparitySupported(Landroid/hardware/camera2/CameraCharacteristics;)Z
    .registers 2
    .param p0, "characteristics"    # Landroid/hardware/camera2/CameraCharacteristics;

    const/4 v0, 0x0

    return v0
.end method

# Force camera.gouda.monocular_depth to return true (0x1)
.method public final isMonocularDepthForced()Z
    .registers 2
    const/4 v0, 0x1
    return v0
.end method

# Routes front camera Portrait/Gouda mode through universal TFLite segmentation model
.method public static isMonocularDepthEnabled()Z
    .registers 2

    const/4 v0, 0x1

    return v0
.end method

# =========================================================================
# Item 5: Feature Flags (Pro Controls, Quick Access, Creator Suite, Looks)
# =========================================================================

# Pro Controls: camera.ark -> return true (0x1)
.method public static isArkSupported()Z
    .registers 2
    const/4 v0, 0x1
    return v0
.end method

# Viewfinder Quick Access slots: camera.quick_access -> return true (0x1)
.method public static isQuickAccessEnabled()Z
    .registers 2
    const/4 v0, 0x1
    return v0
.end method

# Camera Looks fallback: camera.sauce -> return true (0x1)
.method public static isSauceEnabled()Z
    .registers 2
    const/4 v0, 0x1
    return v0
.end method

# Creator Suite: Biotite Teleprompter HUD -> return true (0x1)
.method public static isBiotiteEnabled()Z
    .registers 2
    const/4 v0, 0x1
    return v0
.end method

# Creator Suite: Mica Live Audio VU Meter -> return true (0x1)
.method public static isMicaEnabled()Z
    .registers 2
    const/4 v0, 0x1
    return v0
.end method

# Creator Suite: Slate Social Framing Guides -> return true (0x1)
.method public static isSlateEnabled()Z
    .registers 2
    const/4 v0, 0x1
    return v0
.end method

# Motion Blur / Action Pan / Long Exposure: camera.lasagna -> return false (0x0)
# Leaving this returning 0x0 prevents /dev/gxp SELinux queue hangs on untrusted_app domain
.method public static isLasagnaSupported()Z
    .registers 2
    const/4 v0, 0x0
    return v0
.end method

# General property map configuration
.method public static configureGoudaProperties(Ljava/util/Map;)V
    .registers 3
    .param p0, "configMap"    # Ljava/util/Map;

    if-nez p0, :cond_null

    return-void

    :cond_null
    const-string v0, "camera.gouda.monocular_depth"

    # Set camera.gouda.monocular_depth to true
    sget-object v1, Ljava/lang/Boolean;->TRUE:Ljava/lang/Boolean;

    invoke-interface {p0, v0, v1}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    return-void
.end method
