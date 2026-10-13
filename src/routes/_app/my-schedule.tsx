import Loading from "@/components/spinner/Loading";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSchedule } from "@/hooks/useSchedule";
import { useAuth } from "@/providers/AuthProvider";
import { horarioSchema, type HorarioForm } from "@/schemas/schedule.schema";
import type { Horario } from "@/services/schedule.service";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { SchedulerEventColor } from "@mui/x-scheduler/models";

export const Route = createFileRoute("/_app/my-schedule")({
  component: MySchedule,
});

const dias: {
  key: keyof Horario;
  label: string;
}[] = [
  { key: "lunes", label: "Lunes" },
  { key: "martes", label: "Martes" },
  { key: "miercoles", label: "Miércoles" },
  { key: "jueves", label: "Jueves" },
  { key: "viernes", label: "Viernes" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

const defaultValues: Horario = {
  lunes: { descanso: false, entrada: "", salida: "" },
  martes: { descanso: false, entrada: "", salida: "" },
  miercoles: { descanso: false, entrada: "", salida: "" },
  jueves: { descanso: false, entrada: "", salida: "" },
  viernes: { descanso: false, entrada: "", salida: "" },
  sabado: { descanso: true, entrada: "", salida: "" },
  domingo: { descanso: true, entrada: "", salida: "" },
};

const colores: { value: SchedulerEventColor; className: string }[] = [
  { value: "red", className: "bg-red-500" },
  { value: "orange", className: "bg-orange-500" },
  { value: "amber", className: "bg-amber-500" },
  { value: "lime", className: "bg-lime-500" },
  { value: "green", className: "bg-green-500" },
  { value: "teal", className: "bg-teal-500" },
  { value: "blue", className: "bg-blue-500" },
  { value: "indigo", className: "bg-indigo-500" },
  { value: "purple", className: "bg-purple-500" },
  { value: "pink", className: "bg-pink-500" },
  { value: "grey", className: "bg-gray-500" },
];

function MySchedule() {
  const usuario = useAuth();
  const userId = usuario.user?.uid;

  const { register, control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<HorarioForm>({
    defaultValues,
    resolver: zodResolver(horarioSchema),
  });

  const { schedule, isLoading, isSaving, saveSchedule } = useSchedule(userId);
  const { profile, saveUserInfo, isSavingInfo, isLoading: isLoadingInfo } = useUserProfile();

  useEffect(() => {
    if (schedule) {
      reset(schedule);
    }
  }, [schedule, reset]);

  const onSubmit = async (data: HorarioForm) => {
    try {
      await saveSchedule(data);
      console.log("Horario guardado correctamente");
    } catch (error) {
      console.error("Error al guardar horario:", error);
    }
  };

  const handleColorChange = async (color: SchedulerEventColor) => {
    try {
      await saveUserInfo(color);
    } catch (error) {
      console.error("Error al guardar el color:", error);
    }
  };

  if (isLoading) {
    return <Loading texto="Cargando horario..." />;
  }

  if (isLoadingInfo) {
    return <Loading texto="Cargando información del usuario..." />;
  }

  if (isSavingInfo) {
    return <Loading texto="Guardando información del usuario..." />;
  }

  if (isSaving) {
    return <Loading texto="Guardando horario..." />;
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl px-3 py-4 sm:px-6 sm:py-6">
      {/* Información del usuario */}
      <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex min-w-0 flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-6">
          {usuario.user?.photoURL ? (
            <img
              src={usuario.user.photoURL}
              alt={usuario.user.displayName ?? "Usuario"}
              className="h-16 w-16 shrink-0 rounded-full border-2 border-primary/20 object-cover sm:h-20 sm:w-20"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-muted text-xl font-semibold sm:h-20 sm:w-20">
              {(usuario.user?.displayName ?? "U").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex min-w-0 w-full flex-col items-center text-center sm:items-start sm:text-left">
            <p className="mt-1 max-w-full wrap-break-word text-lg font-medium">
              {usuario.user?.displayName}
            </p>

            <p className="max-w-full break-all text-sm text-muted-foreground">
              {usuario.user?.email}
            </p>

            {/* Selector de color */}
            <div className="mt-4 w-full">
              <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                {colores.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    aria-label={`Seleccionar color ${color.value}`}
                    aria-pressed={profile?.color === color.value}
                    className={`
                      size-7 shrink-0 rounded-full transition-all
                      hover:scale-110 hover:cursor-pointer
                      focus:outline-none focus:ring-2
                      focus:ring-primary focus:ring-offset-2
                      disabled:cursor-not-allowed disabled:opacity-50
                      ${color.className}
                      ${
                        profile?.color === color.value
                          ? "scale-110 ring-2 ring-primary ring-offset-2"
                          : ""
                      }
                    `}
                    onClick={() => handleColorChange(color.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horario */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="mt-6 min-w-0 rounded-xl border bg-card p-3 shadow-sm sm:mt-8 sm:p-6">
          <div className="mb-5 px-1">
            <h2 className="text-lg font-semibold text-center">Horario fijo</h2>
          </div>

          {/* VISTA MÓVIL */}
          <div className="space-y-3 md:hidden">
            {dias.map(({ key, label }) => {
              const descanso = watch(`${key}.descanso`);

              return (
                <article key={key} className="min-w-0 rounded-lg border border-border p-3 sm:p-4">
                  {/* Día y descanso */}
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{label}</h3>

                    <div className="flex shrink-0 items-center gap-2">
                      <label
                        htmlFor={`${key}-descanso`}
                        className="text-sm text-muted-foreground"
                      >
                        Descanso
                      </label>

                      <Controller
                        name={`${key}.descanso`}
                        control={control}
                        render={({ field }) => (
                          <Switch
                            id={`${key}-descanso`}
                            className="hover:cursor-pointer"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Entrada y salida */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <label
                        htmlFor={`${key}-entrada`}
                        className="mb-1 block text-sm font-medium text-muted-foreground"
                      >
                        Entrada
                      </label>

                      <input
                        id={`${key}-entrada`}
                        type="time"
                        disabled={descanso}
                        {...register(`${key}.entrada`)}
                        className={`
                          h-10 w-full min-w-0 rounded-md border
                          bg-background px-2 text-sm outline-none transition
                          focus:border-primary focus:ring-2 focus:ring-primary/20
                          disabled:cursor-not-allowed disabled:opacity-50
                          ${errors[key]?.entrada ? "border-destructive" : "border-input"}
                        `}
                      />

                      {errors[key]?.entrada && (
                        <p className="mt-1 break-words text-xs text-destructive">
                          {errors[key]?.entrada?.message}
                        </p>
                      )}
                    </div>

                    <div className="min-w-0">
                      <label
                        htmlFor={`${key}-salida`}
                        className="mb-1 block text-sm font-medium text-muted-foreground"
                      >
                        Salida
                      </label>

                      <input
                        id={`${key}-salida`}
                        type="time"
                        disabled={descanso}
                        {...register(`${key}.salida`)}
                        className={`
                          h-10 w-full min-w-0 rounded-md border
                          bg-background px-2 text-sm outline-none transition
                          focus:border-primary focus:ring-2 focus:ring-primary/20
                          disabled:cursor-not-allowed disabled:opacity-50
                          ${errors[key]?.salida ? "border-destructive" : "border-input"}
                        `}
                      />

                      {errors[key]?.salida && (
                        <p className="mt-1 break-words text-xs text-destructive">
                          {errors[key]?.salida?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* VISTA ESCRITORIO */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[600px] table-fixed text-sm">
              <thead className="border-b bg-accent/50">
                <tr className="text-left">
                  <th className="w-[25%] px-4 py-3 font-medium text-muted-foreground">
                    Día
                  </th>

                  <th className="w-[20%] px-4 py-3 text-center font-medium text-muted-foreground">
                    Descanso
                  </th>

                  <th className="w-[27.5%] px-4 py-3 font-medium text-muted-foreground">
                    Entrada
                  </th>

                  <th className="w-[27.5%] px-4 py-3 font-medium text-muted-foreground">
                    Salida
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {dias.map(({ key, label }) => {
                  const descanso = watch(`${key}.descanso`);

                  return (
                    <tr
                      key={key}
                      className="transition-colors hover:bg-accent/30"
                    >
                      <td className="px-4 py-4 font-medium">{label}</td>

                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <Controller
                            name={`${key}.descanso`}
                            control={control}
                            render={({ field }) => (
                              <Switch
                                className="hover:cursor-pointer"
                                checked={field.value}
                                onCheckedChange={(checked) => {
  field.onChange(checked);

  if (checked) {
    setValue(`${key}.entrada`, "", { shouldValidate: true });
    setValue(`${key}.salida`, "", { shouldValidate: true });
  }
}}
                                aria-label={`Día de descanso: ${label}`}
                              />
                            )}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="time"
                          disabled={descanso}
                          {...register(`${key}.entrada`)}
                          className={`
                            h-10 w-full min-w-0 rounded-md border
                            bg-background px-3 outline-none transition
                            focus:border-primary focus:ring-2 focus:ring-primary/20
                            disabled:cursor-not-allowed disabled:opacity-50
                            ${errors[key]?.entrada ? "border-destructive" : "border-input"}
                          `}
                        />

                        {errors[key]?.entrada && (
                          <p className="mt-1 text-xs text-destructive">
                            {errors[key]?.entrada?.message}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="time"
                          disabled={descanso}
                          {...register(`${key}.salida`)}
                          className={`
                            h-10 w-full min-w-0 rounded-md border
                            bg-background px-3 outline-none transition
                            focus:border-primary focus:ring-2 focus:ring-primary/20
                            disabled:cursor-not-allowed disabled:opacity-50
                            ${errors[key]?.salida ? "border-destructive" : "border-input"}
                          `}
                        />

                        {errors[key]?.salida && (
                          <p className="mt-1 text-xs text-destructive">
                            {errors[key]?.salida?.message}
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Guardar */}
          <div className="mt-5 border-t border-border pt-4 sm:mt-6 sm:flex sm:justify-end">
            <Button
              type="submit"
              className="w-full hover:cursor-pointer sm:w-auto"
              size="lg"
            >
              Guardar horario
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
}
