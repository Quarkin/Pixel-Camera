.class public final Lcom/google/android/apps/camera/ui/dial/ProDialListener;
.super Ljava/lang/Object;
.source "PG"

# interfaces
.implements Landroid/widget/NumberPicker$OnValueChangeListener;


# direct methods
.method public constructor <init>()V
    .registers 1

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public final onScroll(Landroid/view/View;I)V
    .registers 6
    .param p1, "view"    # Landroid/view/View;
    .param p2, "scrollState"    # I

    if-nez p1, :cond_null

    return-void

    :cond_null
    # Injected by ProControlsPatch:
    # Trigger HapticFeedbackConstants.CLOCK_TICK (0x4) with FLAG_IGNORE_VIEW_SETTING (0x1)
    const/4 v0, 0x4
    const/4 v1, 0x1

    invoke-virtual {p1, v0, v1}, Landroid/view/View;->performHapticFeedback(II)Z

    return-void
.end method

.method public final onValueChanged(Landroid/view/View;II)V
    .registers 7
    .param p1, "view"    # Landroid/view/View;
    .param p2, "oldVal"    # I
    .param p3, "newVal"    # I

    if-eq p2, p3, :cond_same

    if-eqz p1, :cond_same

    # Trigger HapticFeedbackConstants.CLOCK_TICK (0x4) on dial step change
    const/4 v0, 0x4
    const/4 v1, 0x1

    invoke-virtual {p1, v0, v1}, Landroid/view/View;->performHapticFeedback(II)Z

    :cond_same
    return-void
.end method
