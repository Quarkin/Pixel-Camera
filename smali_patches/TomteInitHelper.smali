.class public final LTomteInitHelper;
.super Ljava/lang/Object;
.source "TomteInitHelper.java"

# static fields
# Halide worker pool thread limit set to 2.
# Critical for 6GB RAM devices (e.g. Pixel 6a "bluejay", Pixel 7a "lynx")
# to prevent the system Low Memory Killer (LMK) from terminating the camera process during burst shots.
.field public static final MAX_HALIDE_WORKER_THREADS:I = 0x2

# Capture queue depth capped at 2 to prevent out-of-memory crashes during HDR+ burst shots on 6GB RAM
.field public static final MAX_CAPTURE_QUEUE_DEPTH:I = 0x2


# direct methods
.method public constructor <init>()V
    .registers 1

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static getMaxWorkerThreads()I
    .registers 1
    const/4 v0, 0x2
    return v0
.end method

.method public static getMaxCaptureQueueDepth()I
    .registers 1
    const/4 v0, 0x2
    return v0
.end method

.method public static initHalideWorkerPool()V
    .registers 2

    # Initialize Halide worker thread pool with max 2 threads
    const/4 v0, 0x2

    invoke-static {v0}, LTomteInitHelper;->setNativeWorkerThreadLimit(I)V

    return-void
.end method

.method private static native setNativeWorkerThreadLimit(I)V
.end method
