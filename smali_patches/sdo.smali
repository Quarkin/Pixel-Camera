.class public final Lsdo;
.super Ljava/lang/Object;
.source "PG"


# direct methods
.method public constructor <init>()V
    .registers 1

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

# Thermal state getter: forced to always return 0x0 (THERMAL_STATUS_NONE / normal).
# Prevents Google Camera from throttling Halide worker threads or degrading pipeline performance
# on Tensor G1/G2 devices under warm operating conditions.
.method public final a()I
    .registers 2

    # Return 0x0 (THERMAL_STATUS_NONE)
    const/4 v0, 0x0

    return v0
.end method

.method public final getCurrentThermalStatus()I
    .registers 2

    # Return 0x0 (THERMAL_STATUS_NONE)
    const/4 v0, 0x0

    return v0
.end method

.method public static getThermalLevel()I
    .registers 1

    # Return 0x0 (THERMAL_STATUS_NONE)
    const/4 v0, 0x0

    return v0
.end method

.method public final isThermalThrottling()Z
    .registers 2

    # False: Never trigger thermal throttling
    const/4 v0, 0x0

    return v0
.end method
