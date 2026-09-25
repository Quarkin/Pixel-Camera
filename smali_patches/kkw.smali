.class public final Lkkw;
.super Ljava/lang/Object;
.source "PG"

# static fields
# JPEG encoding configuration module:
# Compression quality integer overridden from 0x5F (95%) to 0x64 (100%) for zero-loss output
.field public static final DEFAULT_JPEG_QUALITY:I = 0x64


# direct methods
.method public constructor <init>()V
    .registers 1

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

# Returns default JPEG compression quality
# Overridden from 0x5F (95) to 0x64 (100) for zero-loss, artifact-free JPEG encoding
.method public static getJpegQuality()I
    .registers 1

    const/16 v0, 0x64

    return v0
.end method

.method public static getQualityForStream(I)I
    .registers 2
    .param p0, "streamType"    # I

    # Force 100% quality (0x64) across all capture streams
    const/16 v0, 0x64

    return v0
.end method

# Injects JPEG_QUALITY into Camera2 CaptureRequest.Builder
.method public final configureJpegQuality(Landroid/hardware/camera2/CaptureRequest$Builder;)V
    .registers 4
    .param p1, "builder"    # Landroid/hardware/camera2/CaptureRequest$Builder;

    if-nez p1, :cond_null

    return-void

    :cond_null
    sget-object v0, Landroid/hardware/camera2/CaptureRequest;->JPEG_QUALITY:Landroid/hardware/camera2/CaptureRequest$Key;

    # Override 0x5F -> 0x64
    const/16 v1, 0x64
    invoke-static {v1}, Ljava/lang/Byte;->valueOf(B)Ljava/lang/Byte;
    move-result-object v1

    invoke-virtual {p1, v0, v1}, Landroid/hardware/camera2/CaptureRequest$Builder;->set(Landroid/hardware/camera2/CaptureRequest$Key;Ljava/lang/Object;)V

    return-void
.end method
