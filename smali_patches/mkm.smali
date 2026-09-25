.class public final Lmkm;
.super Ljava/lang/Object;
.source "PG"

# instance fields
.field public a:Lcom/google/android/apps/camera/stats/timing/ShotCallback;


# direct methods
.method public constructor <init>()V
    .registers 1

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

# virtual methods
.method public final j(Lcom/google/android/apps/camera/stats/timing/ShotCallback;I)V
    .registers 4
    .param p1, "callback"    # Lcom/google/android/apps/camera/stats/timing/ShotCallback;
    .param p2, "reason"    # I

    # Check if ShotCallback is null before early return
    if-eqz p1, :cond_early_return

    # Invoke notifyFailed() if callback exists
    invoke-interface {p1}, Lcom/google/android/apps/camera/stats/timing/ShotCallback;->notifyFailed()V

    :cond_early_return
    return-void
.end method

.method public final j()V
    .registers 2

    # Check if instance field a (ShotCallback) is null before early return
    iget-object v0, p0, Lmkm;->a:Lcom/google/android/apps/camera/stats/timing/ShotCallback;

    if-eqz v0, :cond_early_return

    # Invoke notifyFailed() if it exists
    invoke-interface {v0}, Lcom/google/android/apps/camera/stats/timing/ShotCallback;->notifyFailed()V

    :cond_early_return
    return-void
.end method
