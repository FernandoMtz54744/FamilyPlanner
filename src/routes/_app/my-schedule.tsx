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
  lunes: {descanso: false, entrada: "", salida: ""},
  martes: {descanso: false, entrada: "", salida: ""},
  miercoles: {descanso: false, entrada: "", salida: ""},
  jueves: {descanso: false, entrada: "", salida: ""},
  viernes: {descanso: false, entrada: "", salida: ""},
  sabado: {descanso: true, entrada: "", salida: ""},
  domingo: {descanso: true, entrada: "",salida: ""},
};

const colores: { value: SchedulerEventColor, className: string }[] = [
  { value: 'red', className: 'bg-red-500' },
  { value: 'orange', className: 'bg-orange-500' },
  { value: 'amber', className: 'bg-amber-500' },
  { value: 'lime', className: 'bg-lime-500' },
  { value: 'green', className: 'bg-green-500' },
  { value: 'teal', className: 'bg-teal-500' },
  { value: 'blue', className: 'bg-blue-500' },
  { value: 'indigo', className: 'bg-indigo-500' },
  { value: 'purple', className: 'bg-purple-500' },
  { value: 'pink', className: 'bg-pink-500' },
  { value: 'grey', className: 'bg-gray-500' },
]

function MySchedule() {
    const usuario = useAuth();
    const userId = usuario.user?.uid;

    const { register, control, handleSubmit, watch, reset,  formState: { errors } } = useForm<HorarioForm>({
        defaultValues,
        resolver: zodResolver(horarioSchema)
    });

    const { schedule, isLoading, isSaving, saveSchedule } = useSchedule(userId);
    const { profile, saveUserInfo, isSavingInfo, isLoading: isLoadingInfo } = useUserProfile();

    useEffect(() => {
        if (schedule) {
            reset(schedule)
        }
    }, [schedule, reset]);

    const onSubmit = async (data: HorarioForm) => {
      try {
          await saveSchedule(data)
          console.log('Horario guardado correctamente')
      } catch (error) {
        console.error('Error al guardar horario:', error)
      }
    };

  const handleColorChange = async (color: SchedulerEventColor) => {
    try {
      await saveUserInfo(color)
    } catch (error) {
      console.error('Error al guardar el color:',error);
    }
  }

    if (isLoading) {
      return <Loading texto="cargando horario..."/>
    }

    if (isLoadingInfo) {
      return <Loading texto="cargando información del usuario..."/>
    }

    if (isSavingInfo) {
      return <Loading texto="Guardando información del usuario..."/>
    }

    if (isSaving) {
      return <Loading texto="Guardando horario..."/>
    }

  return (
    <div>
      {/* Información del usuario */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <img
          src={usuario.user?.photoURL ?? ""}
          alt={usuario.user?.displayName ?? "Usuario"}
          className="h-20 w-20 rounded-full border-2 border-primary/20 object-cover"
        />

        <div className="flex flex-col text-center sm:text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Mi horario
          </h1>

          <p className="mt-1 text-lg font-medium">
            {usuario.user?.displayName}
          </p>

          <p className="text-sm text-muted-foreground">
            {usuario.user?.email}
          </p>

          {/* Selector de color */}
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">
              Color de mis eventos
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {colores.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  aria-label={`Seleccionar color ${color.value}`}
                  className={`
                    size-7 rounded-full
                    hover:cursor-pointer
                    ${color.className}
                    transition-all
                    hover:scale-110
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                    focus:ring-offset-2
                    ${
                      profile?.color === color.value
                        ? 'scale-110 ring-2 ring-primary ring-offset-2'
                        : ''
                    }
                  `}
                  onClick={() => handleColorChange(color.value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Horario */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 overflow-hidden rounded-xl border bg-card shadow-sm">
          <table className="w-full table-fixed text-sm">
            <thead className="border-b bg-accent/50">
              <tr className="text-left">
                <th className="w-28 px-4 py-3 font-medium text-muted-foreground">
                  Día
                </th>

                <th className="w-28 px-4 py-3 text-center font-medium text-muted-foreground">
                  Descanso
                </th>

                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Entrada
                </th>

                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Salida
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {dias.map(({ key, label }) => {
                const descanso = watch(`${key}.descanso`);

                return (
                  <tr key={key} className="transition-colors hover:bg-accent/30">
                    {/* Día */}
                    <td className="px-4 py-3 font-medium">{label}</td>

                    {/* Descanso */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Controller
                          name={`${key}.descanso`}
                          control={control}
                          render={({ field }) => (
                            <Switch className="hover:cursor-pointer"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </td>

                    {/* Entrada */}
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        disabled={descanso}
                        {...register(`${key}.entrada`)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      {errors[key]?.entrada && ( 
                        <p className="mt-1 text-xs text-destructive">
                            {errors[key].entrada.message}
                        </p>
                        )}
                    </td>

                    {/* Salida */}
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        disabled={descanso}
                        {...register(`${key}.salida`)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      {errors[key]?.entrada && ( 
                        <p className="mt-1 text-xs text-destructive">
                            {errors[key].entrada.message}
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
        <div className="mt-4 flex justify-end">
          <Button type="submit" className="hover:cursor-pointer" size="lg">Guardar horario</Button>
        </div>
      </form>
    </div>
  );
}
