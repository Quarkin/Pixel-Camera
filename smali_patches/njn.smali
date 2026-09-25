.class public final Lnjn;
.super Ljava/lang/Object;
.source "PG"


# direct methods
.method public constructor <init>()V
    .registers 1

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

# Thermal status getter: returns 0x0 (normal/none)
# Protects Halide processing pipeline against down-scaling worker concurrency.
.method public final a()I
    .registers 2

    # Normal thermal state (0x0)
    const/4 v0, 0x0

    return v0
.end method

.method public final getCurrentThermalStatus()I
    .registers 2

    # Normal thermal state (0x0)
    const/4 v0, 0x0

    return v0
.end method

.method public static getThermalStatus()I
    .registers 1

    # Normal thermal state (0x0)
    const/4 v0, 0x0

    return v0
.end method
