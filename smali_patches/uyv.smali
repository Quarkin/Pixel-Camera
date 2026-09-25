.class public final Luyv;
.super Ljava/lang/Object;
.source "PG"


# direct methods
.method public constructor <init>()V
    .registers 1

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static applyRawOverrides(Landroid/hardware/camera2/CameraCharacteristics;II)[I
    .registers 6
    .param p0, "characteristics"    # Landroid/hardware/camera2/CameraCharacteristics;
    .param p1, "width"    # I
    .param p2, "height"    # I

    # Check if running on Pixel 6a
    sget-object v0, Landroid/os/Build;->DEVICE:Ljava/lang/String;
    const-string v1, "bluejay"
    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z
    move-result v0
    if-eqz v0, :cond_apply_custom_dims

    # Skip 50MP quad-binned overrides and use native sensor dimensions
    goto :skip_raw_override

    :cond_apply_custom_dims
    # (Existing 0x7e0 / 0x5e8 dimension injection stays here)
    const/16 p1, 0x7e0
    const/16 p2, 0x5e8

    :skip_raw_override
    # Native dimensions preserved for Pixel 6a (IMX363) preventing IllegalArgumentException
    const/4 v0, 0x2
    new-array v0, v0, [I
    const/4 v1, 0x0
    aput p1, v0, v1
    const/4 v1, 0x1
    aput p2, v0, v1

    return-object v0
.end method

.method public final l()Z
    .registers 2

    # Camera Looks eligibility: true
    const/4 v0, 0x1

    return v0
.end method
