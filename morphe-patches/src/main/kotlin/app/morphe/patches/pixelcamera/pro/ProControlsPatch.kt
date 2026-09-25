package app.morphe.patches.pixelcamera.pro

import app.morphe.patcher.annotation.Description
import app.morphe.patcher.annotation.Name
import app.morphe.patcher.annotation.Patch
import app.morphe.patcher.annotation.Version
import app.morphe.patcher.context.PatchContext
import app.morphe.patcher.patch.BytecodePatch

@Patch
@Name("Pro Controls Haptic Ticks")
@Description("Injects HapticFeedbackConstants.CLOCK_TICK trigger into onScroll and onValueChanged listeners for manual ISO and Shutter Speed dials.")
@Version("1.0.3")
class ProControlsPatch : BytecodePatch() {

    override fun execute(context: PatchContext) {
        // Target dial listeners for manual ISO and Shutter Speed:
        // Injects view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK, HapticFeedbackConstants.FLAG_IGNORE_VIEW_SETTING)
        // Smali:
        //   const/4 v1, 0x4   # android.view.HapticFeedbackConstants.CLOCK_TICK
        //   const/4 v2, 0x1   # android.view.HapticFeedbackConstants.FLAG_IGNORE_VIEW_SETTING
        //   invoke-virtual {v0, v1, v2}, Landroid/view/View;->performHapticFeedback(II)Z

        val dialTargetClasses = listOf(
            "com.google.android.apps.camera.ui.dial.IsoDialListener",
            "com.google.android.apps.camera.ui.dial.ShutterSpeedDialListener",
            "com.google.android.apps.camera.ui.dial.ProSliderController",
            "qaa", // Obfuscated ISO dial controller
            "qbb"  // Obfuscated Shutter Speed dial controller
        )

        for (className in dialTargetClasses) {
            val classDef = context.findClass(className) ?: continue

            for (method in classDef.methods) {
                if (method.name == "onScroll" || method.name == "onValueChanged") {
                    method.implementation?.let { impl ->
                        // Inject HapticFeedbackConstants.CLOCK_TICK (0x4) trigger on dial detents
                        // Performs physical tactile feedback at every discrete ISO and Shutter step
                        val instructions = """
                            # Injected by ProControlsPatch: HapticFeedbackConstants.CLOCK_TICK
                            const/4 v1, 0x4
                            const/4 v2, 0x1
                            invoke-virtual {p1, v1, v2}, Landroid/view/View;->performHapticFeedback(II)Z
                        """.trimIndent()
                        impl.addInstructions(0, instructions)
                    }
                }
            }
        }
    }
}
