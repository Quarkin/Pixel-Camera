package app.morphe.patches.pixelcamera.clone

import app.morphe.patcher.annotation.Description
import app.morphe.patcher.annotation.Name
import app.morphe.patcher.annotation.Patch
import app.morphe.patcher.annotation.Version
import app.morphe.patcher.context.PatchContext
import app.morphe.patcher.patch.ResourcePatch

@Patch
@Name("Pixel Camera Clone")
@Description("Allows installing alongside the original Google Camera app by updating the package name and provider authorities.")
@Version("1.0.3")
class PixelCameraClonePatch : ResourcePatch() {

    override fun execute(context: PatchContext) {
        // Ensure both authorities are modified in the AndroidManifest:
        context.manifest.application.providers.forEach { provider ->
            provider.authority = provider.authority
                .replace("com.google.android.GoogleCamera", "com.google.android.GoogleCamera.morphe")
                .replace("com.google.android.apps.camera.specialtypes", "com.google.android.apps.camera.specialtypes.morphe")
        }

        // XML editor pass for raw DOM manifest transformations if direct manifest AST is serialized
        val manifest = context.resourceContext.xmlEditor["AndroidManifest.xml"] ?: return
        val application = manifest.rootElement.getChild("application") ?: return

        val providers = application.getChildren("provider")
        for (provider in providers) {
            val authorityAttr = provider.getAttribute("android:authorities")
                ?: provider.getAttribute("authorities")
                ?: continue

            authorityAttr.value = authorityAttr.value
                .replace("com.google.android.GoogleCamera", "com.google.android.GoogleCamera.morphe")
                .replace("com.google.android.apps.camera.specialtypes", "com.google.android.apps.camera.specialtypes.morphe")
        }
    }
}
