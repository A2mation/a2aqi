import { UseFormSetValue, FieldValues, Path, PathValue } from "react-hook-form";
import toast from "react-hot-toast";

/**
 * A generic helper to set geolocation coordinates for any form schema.
 * @param setValue - The setValue function from useForm
 * @param latKey - The key name for latitude in your schema (e.g., "lat" or "latitude")
 * @param lngKey - The key name for longitude in your schema (e.g., "lng" or "long")
 */
export const handleGetLocation = <T extends FieldValues>(
    setValue: UseFormSetValue<T>,
    latKey: Path<T> = "lat" as Path<T>,
    lngKey: Path<T> = "lng" as Path<T>
) => {
    if (!("geolocation" in navigator)) {
        toast.error("Geolocation is not supported by your browser.");
        return;
    }

    const toastId = toast.loading("Detecting location...");

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;

            setValue(latKey, latitude.toString() as PathValue<T, Path<T>>, {
                shouldValidate: true,
                shouldDirty: true,
            });
            setValue(lngKey, longitude.toString() as PathValue<T, Path<T>>, {
                shouldValidate: true,
                shouldDirty: true,
            });

            toast.success("Location detected successfully 📍", { id: toastId });
        },
        (err) => {
            let message = "Failed to get location";
            if (err.code === 1) message = "Please allow location access in your browser.";
            toast.error(message, { id: toastId });
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
};